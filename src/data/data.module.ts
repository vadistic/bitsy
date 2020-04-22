import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { DataGlobalController } from './global.controller';
import { GlobalService } from './global.service';
import { IdentifierService } from './identifier.service';

@Module({
  providers: [DataService, GlobalService, IdentifierService],
  controllers: [DataController, DataGlobalController],
})
export class DataModule {}
