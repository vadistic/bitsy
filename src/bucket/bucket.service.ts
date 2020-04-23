import { Injectable } from '@nestjs/common';
import { MongoService } from '../mongo';
import { BucketModel } from './bucket.model';
import { SlugDTO, AccessDTO, toMongo, toClass, ValueDTO } from '../common';
import { ObjectId } from 'mongodb';
import { ItemService } from '../item';

@Injectable()
export class BucketService {
  constructor(
    private readonly mongo: MongoService,
    private readonly itemService: ItemService,
  ) {}

  buckets = this.mongo.db.collection<BucketModel>(BucketModel.collection);

  async getBucket({ slug }: SlugDTO): Promise<BucketModel | null> {
    return this.buckets
      .findOne({ slug })
      .then((res) => toClass(BucketModel, res));
  }

  async createBucket({
    access,
    slug,
    value,
  }: SlugDTO & AccessDTO & ValueDTO): Promise<BucketModel> {
    const objectId = new ObjectId();
    const timestamp = objectId.getTimestamp().toISOString();

    const input: BucketModel = {
      _id: objectId.toHexString(),
      createdAt: timestamp,
      updatedAt: null,
      count: 0,
      items: [],
      access,
      slug,
    };

    await this.buckets.insertOne(toMongo(BucketModel, input));

    if (value) {
      const item = await this.itemService.createItem({ slug, value });
      input.count = 1;
      input.items = [item];
    }

    const result = toClass(BucketModel, input);

    console.log(result);

    return result;
  }
}
