import { Injectable } from '@nestjs/common';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { StrictProjection } from '../types';
import { MongoService } from '../mongo';
import { BucketModel } from './bucket.model';

@Injectable()
export class SlugService {
  constructor(private readonly mongo: MongoService) {}

  buckets = this.mongo.db.collection<BucketModel>(BucketModel.collection);

  generate(): string {
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

  async generateUnique(): Promise<string> {
    const slug = this.generate();

    const cursor = this.buckets
      .find(
        {
          slug,
        },
        { limit: 1 },
      )
      .project({ slug: 1 } as StrictProjection<BucketModel>);

    // very improbable but...
    if (await cursor.hasNext()) {
      return this.generateUnique();
    }

    return slug;
  }
}
