import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { DataGlobalController } from './data.controller.global';

@Module({
  providers: [DataService],
  controllers: [DataController, DataGlobalController],
})
export class DataModule {}
