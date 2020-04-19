import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { FormController } from './data.controller';

@Module({
  providers: [DataService],
  controllers: [FormController],
})
export class FormModule {}
