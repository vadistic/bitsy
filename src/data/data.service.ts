import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UniqueDTO,
  IdentifierDTO,
  ValueDTO,
  ItemDTO,
  BucketDTO,
  BucketShallowDTO,
  ItemShallowDTO,
  CountDTO,
} from './data.dto';
import { MongoService } from '../mongo/mongo.service';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { StrictProjection } from '../types';

export const ITEMS_COLLECTION = 'Items';

@Injectable()
export class DataService {
  constructor(private readonly mongo: MongoService) {}

  collections = {
    items: this.mongo.db.collection<ItemDTO>(ITEMS_COLLECTION),
  };

  getFunnyIdentifier(): string {
    const separator = '-';

    const coolName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator,
      length: 3,
    });

    const num = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0');

    return coolName + separator + num;
  }

  async getUniqueIdentifier(): Promise<string> {
    const uniqueIdentifier = this.getFunnyIdentifier();

    const cursor = this.collections.items
      .find(
        {
          namespace: uniqueIdentifier,
        },
        { limit: 1 },
      )
      .project({ identifier: 1 } as StrictProjection<ItemDTO>);

    // very improbable but...
    if (await cursor.hasNext()) {
      return this.getUniqueIdentifier();
    }

    return uniqueIdentifier;
  }

  // TODO: limit to controller
  async globalFindManyItems(): Promise<ItemShallowDTO[]> {
    const cursor = this.collections.items.find(
      {},
      { limit: 100, sort: { _id: -1 }, projection: { value: 0 } },
    );

    return cursor.toArray();
  }

  async globalFindLastItem(): Promise<ItemDTO | null> {
    const cursor = this.collections.items.find(
      {},
      { sort: { _id: -1 }, limit: 1 },
    );

    return cursor.next();
  }

  async globalFindManyBuckets(): Promise<BucketShallowDTO[]> {
    const cursor = this.collections.items.aggregate<BucketShallowDTO>([
      { $sort: { _id: -1 } },
      {
        $project: {
          value: 0,
        },
      },
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

    return cursor.toArray();
  }

  async globalFindLastBucket(): Promise<BucketDTO | null> {
    const cursor = this.collections.items.aggregate<BucketDTO>([
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

    return cursor.next();
  }

  async findItemById({ _id: id }: UniqueDTO): Promise<ItemDTO | null> {
    const res = await this.collections.items.findOne(
      { _id: { $eq: id } },
      { limit: 1 },
    );

    return res;
  }

  async findManyItems({ identifier }: IdentifierDTO): Promise<ItemDTO[]> {
    const cursor = this.collections.items.find(
      {
        identifier: { $eq: identifier },
      },
      { sort: { _id: -1 } },
    );

    console.log(await cursor.toArray());

    return cursor.toArray();
  }

  async findLastItem({ identifier }: IdentifierDTO): Promise<ItemDTO | null> {
    const res = await this.collections.items.findOne(
      {
        identifier: { $eq: identifier },
      },
      { sort: { _id: -1 } },
    );

    return res;
  }

  async findOneBucket({
    identifier,
  }: IdentifierDTO): Promise<BucketDTO | null> {
    const cursor = this.collections.items.aggregate<BucketDTO>([
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

    return res;
  }

  async pushToBucket({
    identifier: maybeIdentifier,
    value,
  }: Partial<IdentifierDTO> & ValueDTO): Promise<ItemDTO> {
    const identifier = maybeIdentifier ?? (await this.getUniqueIdentifier());
    const item = ItemDTO.create({ identifier, value });

    const res = await this.collections.items.insertOne(item);

    if (!res.result.ok) {
      throw new InternalServerErrorException(res.ops, 'cannot insert');
    }

    return item;
  }

  async deleteBucket({ identifier }: IdentifierDTO): Promise<CountDTO> {
    const res = await this.collections.items.deleteMany({ identifier });

    return { count: res.deletedCount ?? 0 };
  }
}
