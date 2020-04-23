import { Injectable } from '@nestjs/common';
import { MongoService } from '../mongo';
import { SlugDTO, toClass, ValueDTO, toMongo } from '../common';
import { ItemModel, ItemShallowModel } from './item.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class ItemService {
  constructor(private readonly mongo: MongoService) {}

  items = this.mongo.db.collection<ItemModel>(ItemModel.collection);

  async getLastItem({ slug }: SlugDTO): Promise<ItemModel | null> {
    return this.items
      .find({ slug }, { limit: 1, sort: { _id: -1 } })
      .next()
      .then((res) => toClass(ItemModel, res));
  }

  async createItem({
    slug,
    value,
  }: SlugDTO & ValueDTO): Promise<ItemShallowModel> {
    const objectId = new ObjectId();
    const timestamp = objectId.getTimestamp().toISOString();

    const input: ItemModel = {
      _id: objectId.toHexString(),
      createdAt: timestamp,
      updatedAt: null,
      slug,
      value,
    };

    await this.items.insertOne(toMongo(ItemModel, input));

    return toClass(ItemShallowModel, input);
  }
}
