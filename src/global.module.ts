import {
  Module,
  CacheModule,
  NestModule,
  MiddlewareConsumer,
  Global,
} from '@nestjs/common';
import { LoggerModule, MorganMiddleware } from './logger';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, configComputed, configSchema } from './config';

@Global()
@Module({
  imports: [
    LoggerModule,
    CacheModule.register(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      schema: configSchema,
      isGlobal: true,
      load: [configComputed],
      files: './.env.json',
    }),
  ],
})
export class GlobalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('/api');
  }
}
