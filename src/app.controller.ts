import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MongoService } from './mongo/mongo.service';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty()
  message: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    private readonly dbService: MongoService,
  ) {}

  @Get('/api/hello')
  @ApiOkResponse({
    description: `says hello`,
    type: Message,
  })
  getHello() {
    return { message: this.appService.getHello() };
  }
}
