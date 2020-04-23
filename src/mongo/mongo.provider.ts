import { Provider, Inject, LogLevel } from '@nestjs/common';
import { MongoClient, log } from 'mongodb';
import { LoggerService } from '../logger/logger.service';
import { ConfigService, Config } from '../config';

export const MONGO_CLIENT = 'MONGO_CLIENT';

export const InjectMongo = () => Inject(MONGO_CLIENT);

export const MongoProvider: Provider = {
  provide: MONGO_CLIENT,
  useFactory: (config: ConfigService<Config>, logger: LoggerService) => {
    const mongoLogger: log = (msg, state) => {
      const level = (state?.type ?? 'log') as LogLevel;
      logger[level](state?.message, 'MongoModule');
    };

    return MongoClient.connect(config.get('MONGODB_URL'), {
      auth: {
        user: config.get('MONGODB_USER'),
        password: config.get('MONGODB_PASS'),
      },
      loggerLevel: config.get('NODE_ENV') === 'development' ? 'debug' : 'error',
      logger: mongoLogger,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // best setting ever
      ignoreUndefined: true,
    });
  },
  inject: [ConfigService, LoggerService],
};
