import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    private readonly dbService: DatabaseService,
  ) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
