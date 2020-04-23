import { Module } from '@nestjs/common';
import { BucketController } from './bucket.controller';
import { SlugService } from './slug.service';
import { BucketService } from './bucket.service';
import { ItemService } from '../item';

@Module({
  providers: [SlugService, BucketService, ItemService],
  controllers: [BucketController],
})
export class BucketModule {}
