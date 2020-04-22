import { Controller, Get, Query, Post, Body, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageDTO, HelloDTO } from './app.dto';
import { CustomValidationPipe } from './dto/transform';

@Controller('/api')
@UsePipes(CustomValidationPipe)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiOkResponse({ type: MessageDTO })
  getHello(@Query() { name }: HelloDTO): MessageDTO {
    return MessageDTO.create({ message: this.appService.getHello(name) });
  }

  @Post('/message')
  @ApiOkResponse({ type: MessageDTO })
  postMessage(@Body() body: MessageDTO): MessageDTO {
    return MessageDTO.create(body);
  }
}
