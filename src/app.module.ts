import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './mongo/mongo.module';
import { GlobalModule } from './global.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ItemModule } from './item/item.module';
import { BucketModule } from './bucket/bucket.module';

@Module({
  imports: [
    MongoModule,
    GlobalModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'examples/simple'),
      serveRoot: '/examples/simple',
    }),
    ItemModule,
    BucketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
