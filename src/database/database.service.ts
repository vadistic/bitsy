import { Injectable, Inject } from '@nestjs/common';
import { MONGO_CLIENT, MONGO_DB } from './database.module';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(MONGO_CLIENT) readonly client: MongoClient,
    @Inject(MONGO_DB) readonly db: Db,
  ) {}
}
