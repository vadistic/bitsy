import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
  Global,
} from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { MorganMiddleware } from './logger/morgan.middleware';

@Global()
@Module({
  imports: [
    LoggerModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
})
export class GlobalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('/api');
  }
}
