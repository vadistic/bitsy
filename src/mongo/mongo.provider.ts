import { Provider, Inject, LogLevel } from '@nestjs/common';
import { MongoClient, log } from 'mongodb';
import { ConfigT, configuration } from '../config';
import { LoggerService } from '../logger/logger.service';

export const MONGO_CLIENT = 'MONGO_CLIENT';

export const InjectMongo = () => Inject(MONGO_CLIENT);

export const MongoProvider: Provider = {
  provide: MONGO_CLIENT,
  useFactory: (config: ConfigT, logger: LoggerService) => {
    const mongoLogger: log = (msg, state) => {
      const level = (state?.type ?? 'log') as LogLevel;
      logger[level](state?.message, 'MongoModule');
    };

    return MongoClient.connect(config.MONGODB_URL, {
      auth: {
        user: config.MONGODB_USER,
        password: config.MONGODB_PASS,
      },
      loggerLevel: config.DEV ? 'debug' : 'error',
      logger: mongoLogger,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // best setting ever
      ignoreUndefined: true,
    });
  },
  inject: [configuration.KEY, LoggerService],
};
