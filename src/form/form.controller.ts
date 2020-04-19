import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { FormService } from './form.service';
import { NamespaceDto, UniqueDto } from './form.dto';
import { ApiOkResponse, ApiBody } from '@nestjs/swagger';

@Controller('/api/form')
export class FormController {
  constructor(private readonly service: FormService) {}

  @Get('/test')
  @ApiOkResponse({
    description: `healthcheck returns 'ok'`,
  })
  getTest() {
    return 'ok';
  }

  @Get('/all')
  @ApiOkResponse({
    description: `all data globally (please do not use too much)`,
  })
  getAll() {
    return this.service.getAll();
  }

  @Get('/last')
  @ApiOkResponse({
    description: `last data globally`,
  })
  getLast() {
    return this.service.getLast();
  }

  @Get('/id/:id')
  @ApiOkResponse({
    description: `one specific result`,
  })
  getById(@Param() param: UniqueDto) {
    return this.service.getbyId(param);
  }

  @Get('/:namespace/all')
  @ApiOkResponse({
    description: `all data from selected namespace`,
  })
  getNamespacedAll(@Param() param: NamespaceDto) {
    return this.service.getNamespacedAll(param);
  }

  @Get('/:namespace/last')
  @ApiOkResponse({
    description: `last data from selected namespace`,
  })
  getNamespacedLast(@Param() param: NamespaceDto) {
    return this.service.getNamespacedLast(param);
  }

  @Post('/:namespace')
  @ApiOkResponse({
    description: `id of created form`,
  })
  @ApiBody({
    required: true,
    description: 'any data you want to store',
  })
  postNamespaced(@Param() param: NamespaceDto, @Body() body: any) {
    console.log('body', body);

    return this.service.createNamespaced(param, body);
  }
}
