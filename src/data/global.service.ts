import { Injectable } from '@nestjs/common';
import {
  ItemDTO,
  BucketDTO,
  BucketShallowDTO,
  ItemShallowDTO,
} from './data.dto';
import { toClass } from '../dto/transform';
import { PaginationDTO, IdDTO } from '../dto/common.dto';
import { MongoService } from '../mongo/mongo.service';
import { ITEMS_COLLECTION } from './data.provider';

@Injectable()
export class GlobalService {
  constructor(private readonly mongo: MongoService) {}

  items = this.mongo.db.collection<ItemDTO>(ITEMS_COLLECTION);

  async globalFindManyItems({
    limit,
    sort,
  }: PaginationDTO): Promise<ItemShallowDTO[]> {
    const cursor = this.items.find(
      {},
      { limit, sort: { _id: sort }, projection: { value: 0 } },
    );

    return cursor.toArray().then((arr) => toClass(ItemShallowDTO, arr));
  }

  async globalFindLastItem(): Promise<ItemDTO | undefined> {
    const cursor = this.items.find({}, { sort: { _id: -1 }, limit: 1 });

    return cursor
      .next()
      .then((res) => (res ? toClass(ItemDTO, res) : undefined));
  }

  async globalFindManyBuckets({
    limit,
    sort,
  }: PaginationDTO): Promise<BucketShallowDTO[]> {
    const cursor = this.items.aggregate<BucketShallowDTO>([
      { $limit: limit },
      {
        $project: {
          value: 0,
        },
      },
      { $sort: { _id: sort } },
      {
        $group: {
          _id: '$identifier',
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
        },
      },
    ]);

    return cursor.toArray().then((arr) => toClass(BucketShallowDTO, arr));
  }

  async globalFindLastBucket(): Promise<BucketDTO | undefined> {
    const cursor = this.items.aggregate<BucketDTO>([
      { $sort: { _id: -1 } },
      { $limit: 1 },
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

    return cursor
      .next()
      .then((res) => (res ? toClass(BucketDTO, res) : undefined));
  }

  async findItemById({ _id: id }: IdDTO): Promise<ItemDTO | undefined> {
    const res = await this.items.findOne({ _id: { $eq: id } }, { limit: 1 });

    return res ? toClass(ItemDTO, res) : undefined;
  }
}
