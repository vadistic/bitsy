import {
  Controller,
  Get,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataService } from './data.service';
import {
  ItemDTO,
  BucketDTO,
  ItemShallowDTO,
  BucketShallowDTO,
} from './data.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@Controller('/api/global')
@ApiTags('global')
@UsePipes(ValidationPipe)
export class DataGlobalController {
  constructor(private readonly service: DataService) {}

  @Get('/')
  @ApiOkResponse({ type: BucketShallowDTO, isArray: true })
  async getAll(): Promise<BucketShallowDTO[]> {
    return this.service.globalFindManyBuckets();
  }

  @Get('/last')
  @ApiOkResponse({ type: BucketDTO })
  async getLast(): Promise<BucketDTO> {
    const item = await this.service.globalFindLastBucket();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @Get('/items')
  @ApiOkResponse({ type: ItemShallowDTO, isArray: true })
  async getItems(): Promise<ItemShallowDTO[]> {
    const item = await this.service.globalFindManyItems();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @Get('/items/last')
  @ApiOkResponse({ type: ItemDTO })
  async getLastItem(): Promise<ItemDTO> {
    const item = await this.service.globalFindLastItem();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
