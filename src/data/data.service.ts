import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ItemDTO, BucketDTO } from './data.dto';
import {
  PaginationDTO,
  IdentifierDTO,
  ValueDTO,
  CountDTO,
} from '../dto/common.dto';
import { toClass } from '../dto/transform';
import { IdentifierService } from './identifier.service';
import { MongoService } from '../mongo/mongo.service';
import { ITEMS_COLLECTION } from './data.provider';

@Injectable()
export class DataService {
  constructor(
    private readonly mongo: MongoService,
    private readonly identifier: IdentifierService,
  ) {}

  items = this.mongo.db.collection<ItemDTO>(ITEMS_COLLECTION);

  async findManyItems({
    identifier,
    sort,
    limit,
    after,
    before,
  }: IdentifierDTO & Partial<PaginationDTO>): Promise<ItemDTO[]> {
    const cursor = this.items.find(
      {
        _id: {
          $exists: true,
          $gt: after,
          $lt: before,
        },
        identifier: { $eq: identifier },
      },
      { sort: { _id: sort }, limit },
    );

    return cursor.toArray().then((res) => toClass(ItemDTO, res));
  }

  async findLastItem({
    identifier,
  }: IdentifierDTO): Promise<ItemDTO | undefined> {
    const res = await this.items.findOne(
      {
        identifier: { $eq: identifier },
      },
      { sort: { _id: -1 } },
    );

    return res ? toClass(ItemDTO, res) : undefined;
  }

  async findOneBucket({
    identifier,
  }: IdentifierDTO): Promise<BucketDTO | undefined> {
    const cursor = this.items.aggregate<BucketDTO>([
      { $match: { identifier: { $eq: identifier } } },
      { $sort: { _id: -1 } },
      {
        $project: {
          value: 0,
        },
      },
      {
        $group: {
          _id: null,
          createdAt: {
            $last: '$createdAt',
          },
          updatedAt: {
            $first: '$createdAt',
          },
          identifier: {
            $first: '$identifier',
          },
          count: {
            $sum: 1,
          },
          items: {
            $push: '$$ROOT',
          },
        },
      },
    ]);

    const res = await cursor.next();

    return res ? toClass(BucketDTO, res) : undefined;
  }

  async pushToBucket({
    identifier: maybeIdentifier,
    value,
  }: Partial<IdentifierDTO> & ValueDTO): Promise<ItemDTO> {
    const identifier =
      maybeIdentifier ?? (await this.identifier.generateUnique());

    const item = toClass(ItemDTO, { identifier, value });

    const res = await this.items.insertOne(item);

    if (!res.result.ok) {
      throw new InternalServerErrorException();
    }

    return item;
  }

  async deleteBucket({ identifier }: IdentifierDTO): Promise<CountDTO> {
    const res = await this.items.deleteMany({ identifier });

    return toClass(CountDTO, { count: res.deletedCount ?? 0 });
  }
}
