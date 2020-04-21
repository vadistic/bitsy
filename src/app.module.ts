import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { MongoModule } from './mongo/mongo.module';
import { GlobalModule } from './global.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongoModule,
    DataModule,
    GlobalModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'examples/simple'),
      serveRoot: '/examples/simple',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
