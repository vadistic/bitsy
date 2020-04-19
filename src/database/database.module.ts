import { DynamicModule } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { DatabaseService } from './database.service';

export const MONGO_CLIENT = 'MONGO_CLIENT';
export const MONGO_DB = 'MONGO_DB';
export const MONGO_OPTIONS = 'MONGO_OPTIONS';

export interface DatabaseModuleOptions {
  url: string;
  dbName: string;
  auth: {
    user: string;
    password: string;
  };
}

export class DatabaseModule {
  static async registerAsync(
    options: DatabaseModuleOptions,
  ): Promise<DynamicModule> {
    const client = await MongoClient.connect(options.url, {
      // ssl: false,
      auth: options.auth,
      loggerLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db(options.dbName);

    return {
      module: DatabaseModule,
      global: true,
      providers: [
        DatabaseService,
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
      exports: [DatabaseService, MONGO_CLIENT, MONGO_DB, MONGO_OPTIONS],
    };
  }
}
