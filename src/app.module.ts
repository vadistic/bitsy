import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './data/data.module';
import { MongoModule } from './mongo/mongo.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [MongoModule, DataModule, GlobalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
