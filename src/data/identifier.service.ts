import { Injectable } from '@nestjs/common';
import { ItemDTO } from './data.dto';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { StrictProjection } from '../types';
import { ITEMS_COLLECTION } from './data.provider';
import { MongoService } from '../mongo/mongo.service';

@Injectable()
export class IdentifierService {
  constructor(private readonly mongo: MongoService) {}

  items = this.mongo.db.collection<ItemDTO>(ITEMS_COLLECTION);

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
    const uniqueIdentifier = this.generate();

    const cursor = this.items
      .find(
        {
          namespace: uniqueIdentifier,
        },
        { limit: 1 },
      )
      .project({ identifier: 1 } as StrictProjection<ItemDTO>);

    // very improbable but...
    if (await cursor.hasNext()) {
      return this.generateUnique();
    }

    return uniqueIdentifier;
  }
}
