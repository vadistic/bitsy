import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageDTO, HelloDTO } from './app.dto';

@Controller('/api')
@UsePipes(ValidationPipe)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiOkResponse({
    description: `says hello`,
    type: MessageDTO,
  })
  getHello(@Query() { name }: HelloDTO): MessageDTO {
    return MessageDTO.create({ message: this.appService.getHello(name) });
  }

  @Post('/message')
  @ApiOkResponse({
    description: `sends message?`,
    type: MessageDTO,
  })
  postMessage(@Body() body: MessageDTO): MessageDTO {
    return MessageDTO.create(body);
  }
}
