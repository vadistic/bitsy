import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { Message, HelloDTO } from './app.dto';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiOkResponse({
    description: `says hello`,
    type: Message,
  })
  getHello(@Query() { name }: HelloDTO): Message {
    return Message.create({ message: this.appService.getHello(name) });
  }
}
