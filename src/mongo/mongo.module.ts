import { Module, Global } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongoProvider } from './mongo.provider';

@Global()
@Module({
  imports: [],
  providers: [MongoProvider, MongoService],
  exports: [MongoProvider, MongoService],
})
export class MongoModule {}
