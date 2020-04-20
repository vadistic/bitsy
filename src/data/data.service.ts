import { Injectable } from '@nestjs/common';
import { UniqueDTO, IdentifierDTO, ValueDTO, Item } from './data.dto';
import { MongoService } from '../mongo/mongo.service';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

export const ITEMS_COLLECTION = 'Items';

@Injectable()
export class DataService {
  constructor(private readonly mongo: MongoService) {}

  collections = {
    items: this.mongo.db.collection<Item>(ITEMS_COLLECTION),
  };

  async getUniqueIdentifier(): Promise<string> {
    const separator = '-';

    const coolName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator,
      length: 3,
    });

    const num = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2);

    const uniqueIdentifier = coolName + separator + num;

    // very improbable but...
    const isInUse = await this.collections.items
      .find(
        {
          namespace: uniqueIdentifier,
        },
        { limit: 1 },
      )
      .project(['identifier'] as (keyof Item)[])
      .hasNext();

    if (isInUse) {
      return this.getUniqueIdentifier();
    }

    return uniqueIdentifier;
  }

  // async globalFindManyBuckets(): Promise<Bucket[]> {
  //   const cursor = this.collections.items.find();
  //   const all = await cursor.toArray();

  //   return all;
  // }

  // async globalFindLastBucket(): Promise<Bucket | null> {
  //   const res = await this.collections.items.findOne(
  //     {},
  //     { sort: { _id: -1 }, limit: 1 },
  //   );

  //   return res;
  // }

  async globalFindManyItems(): Promise<Item[]> {
    const cursor = this.collections.items.find();

    return cursor.toArray();
  }

  async globalFindLastItem(): Promise<Item | null> {
    const res = await this.collections.items.findOne({}, { sort: { _id: -1 } });

    return res;
  }

  async findItemById({ _id: id }: UniqueDTO): Promise<Item | null> {
    const res = await this.collections.items.findOne(
      { _id: { $eq: id } },
      { limit: 1 },
    );

    return res;
  }

  async findManyItems({ identifier }: IdentifierDTO): Promise<Item[]> {
    const cursor = this.collections.items
      .find({
        identifier: { $eq: identifier },
      })
      .limit(1);

    return cursor.toArray();
  }

  async findLastItem({ identifier }: IdentifierDTO): Promise<Item | null> {
    const res = await this.collections.items.findOne(
      {
        identifier: { $eq: identifier },
      },
      { sort: { _id: -1 } },
    );

    return res;
  }

  async push({
    identifier: maybeIdentifier,
    value,
  }: Partial<IdentifierDTO> & ValueDTO): Promise<Item> {
    const identifier = maybeIdentifier ?? (await this.getUniqueIdentifier());
    const item = Item.create({ identifier, value });

    const res = await this.collections.items.insertOne(item);

    res.result.ok;

    // https://stackoverflow.com/questions/40766654/node-js-mongodb-insert-one-and-return-the-newly-inserted-document
    return res.ops[0];
  }
}
