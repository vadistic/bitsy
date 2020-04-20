import { Provider, Inject } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigT, configuration } from '../config';

export const MONGO_CLIENT = 'MONGO_CLIENT';

export const InjectMongo = () => Inject(MONGO_CLIENT);

export const MongoProvider: Provider = {
  provide: MONGO_CLIENT,
  useFactory: (config: ConfigT) =>
    MongoClient.connect(config.MONGODB_URL, {
      auth: {
        user: config.MONGODB_USER,
        password: config.MONGODB_PASS,
      },
      loggerLevel: config.DEV ? 'debug' : 'error',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  inject: [configuration.KEY],
};
