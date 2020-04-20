import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { LoggerService } from '../logger/logger.service';
import { ConfigT, InjectConfig } from '../config';
import { InjectMongo } from './mongo.provider';

@Injectable()
export class MongoService implements OnModuleDestroy {
  constructor(
    @InjectMongo() readonly client: MongoClient,
    @InjectConfig() private readonly config: ConfigT,
    private readonly logger: LoggerService,
  ) {}

  db = this.client.db(this.config.MONGODB_NAME);

  async onModuleDestroy() {
    await this.client.close();
  }
}
