import { Controller, Get, NotFoundException } from '@nestjs/common';
import { DataService } from './data.service';
import {
  ItemDTO,
  BucketDTO,
  ItemShallowDTO,
  BucketShallowDTO,
} from './data.dto';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('/api/global')
@ApiTags('global')
export class DataGlobalController {
  constructor(private readonly service: DataService) {}

  @Get('/')
  @ApiOperation({
    description: `get list of all buckets globally`,
  })
  @ApiOkResponse({
    type: BucketShallowDTO,
    isArray: true,
  })
  async getAll(): Promise<BucketShallowDTO[]> {
    return this.service.globalFindManyBuckets();
  }

  @Get('/last')
  @ApiOperation({
    description: `get last updated bucket globally`,
  })
  @ApiOkResponse({
    type: BucketDTO,
  })
  async getLast(): Promise<BucketDTO> {
    const item = await this.service.globalFindLastBucket();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @Get('/items')
  @ApiOperation({
    description: `get list of all items globally`,
  })
  @ApiOkResponse({
    type: ItemShallowDTO,
    isArray: true,
  })
  async getItems(): Promise<ItemShallowDTO[]> {
    const item = await this.service.globalFindManyItems();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @Get('/items/last')
  @ApiOperation({
    description: `get last updated item globally`,
  })
  @ApiOkResponse({
    type: ItemDTO,
  })
  async getLastItem(): Promise<ItemDTO> {
    const item = await this.service.globalFindLastItem();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }
}
