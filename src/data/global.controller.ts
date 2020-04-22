import {
  Controller,
  Get,
  NotFoundException,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ItemDTO, ItemShallowDTO, BucketShallowDTO } from './data.dto';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { GlobalService } from './global.service';
import { PaginationDTO } from '../dto/common.dto';
import { CustomValidationPipe } from '../dto/transform';

@Controller('/api/global')
@ApiTags('global')
@UsePipes(CustomValidationPipe)
export class DataGlobalController {
  constructor(private readonly service: GlobalService) {}

  @Get('/')
  @ApiOkResponse({ type: BucketShallowDTO, isArray: true })
  async getAll(@Query() query: PaginationDTO): Promise<BucketShallowDTO[]> {
    return this.service.globalFindManyBuckets(query);
  }

  @Get('/items')
  @ApiOkResponse({ type: ItemShallowDTO, isArray: true })
  @ApiNotFoundResponse()
  async getItems(@Query() query: PaginationDTO): Promise<ItemShallowDTO[]> {
    const items = await this.service.globalFindManyItems(query);

    if (!items.length) {
      throw new NotFoundException();
    }

    return items;
  }

  @Get('/last')
  @ApiOkResponse({ type: ItemDTO })
  @ApiNotFoundResponse()
  async getLastItem(): Promise<ItemDTO> {
    const item = await this.service.globalFindLastItem();

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
