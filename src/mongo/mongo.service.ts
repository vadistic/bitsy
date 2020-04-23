import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { LoggerService } from '../logger';
import { InjectMongo } from './mongo.provider';
import { ConfigService, Config } from '../config';

@Injectable()
export class MongoService implements OnModuleDestroy {
  constructor(
    @InjectMongo() readonly client: MongoClient,
    private readonly config: ConfigService<Config>,
    private readonly logger: LoggerService,
  ) {}

  db = this.client.db(this.config.get('MONGODB_NAME'));

  async onModuleDestroy() {
    await this.client.close();
  }
}
