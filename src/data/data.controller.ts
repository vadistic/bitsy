import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotImplementedException,
} from '@nestjs/common';
import { DataService } from './data.service';
import { NamespaceDto, UniqueDto } from './data.dto';
import { ApiOkResponse, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Form } from './data.model';

@ApiTags('form')
@Controller('/api/form')
export class FormController {
  constructor(private readonly service: DataService) {}

  @Get('/all')
  @ApiOperation({
    description: `all data globally (please do not use too much)`,
  })
  @ApiOkResponse({
    type: Form,
    isArray: true,
  })
  getAll() {
    return this.service.getAll();
  }

  @Get('/last')
  @ApiOperation({
    description: `last item globally`,
  })
  @ApiOkResponse({
    type: Form,
  })
  getLast() {
    return this.service.getLast();
  }

  @Get('/:namespace/all')
  @ApiOperation({
    description: `all items from namespace`,
  })
  @ApiOkResponse({
    type: Form,
    isArray: true,
  })
  getNamespacedAll(@Param() param: NamespaceDto) {
    return this.service.getNamespacedAll(param);
  }

  @Get('/:namespace/last')
  @ApiOperation({ description: `get last item in namespace` })
  @ApiOkResponse({
    type: Form,
  })
  getNamespacedLast(@Param() param: NamespaceDto) {
    return this.service.getNamespacedLast(param);
  }

  @Post('/:namespace')
  @ApiOperation({ description: `create new item` })
  @ApiBody({
    required: true,
    type: 'JSON',
    description: 'any JSON data',
  })
  @ApiOkResponse({
    type: UniqueDto,
  })
  postNamespaced(@Param() param: NamespaceDto, @Body() body: any) {
    return { id: this.service.createNamespaced(param, body) };
  }

  @Post('/:namespace/reset')
  @ApiOperation({ description: `reset data in namespace` })
  resetNamespace() {
    throw new NotImplementedException();
  }
}
