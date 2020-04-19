import { DynamicModule } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { MongoService } from './mongo.service';

export const MONGO_CLIENT = 'MONGO_CLIENT';
export const MONGO_DB = 'MONGO_DB';
export const MONGO_OPTIONS = 'MONGO_OPTIONS';

export interface MongoModuleOptions {
  url: string;
  dbName: string;
  auth: {
    user: string;
    password: string;
  };
}

export class MongoModule {
  static async registerAsync(
    options: MongoModuleOptions,
  ): Promise<DynamicModule> {
    const client = await MongoClient.connect(options.url, {
      auth: options.auth,
      loggerLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db(options.dbName);

    return {
      module: MongoModule,
      global: true,
      providers: [
        MongoService,
        {
          provide: MONGO_CLIENT,
          useValue: client,
        },
        {
          provide: MONGO_DB,
          useValue: db,
        },
        {
          provide: MONGO_OPTIONS,
          useValue: options,
        },
      ],
      exports: [MongoService, MONGO_CLIENT, MONGO_DB, MONGO_OPTIONS],
    };
  }
}
