import {
  Controller,
  Get,
  Param,
  Post,
  NotImplementedException,
  Body,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { DataService } from './data.service';
import { Item, IdentifierDTO, Bucket } from './data.dto';
import { ApiOkResponse, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('/api')
@ApiTags('data')
export class DataController {
  constructor(private readonly service: DataService) {}

  @Get('/all')
  @ApiOperation({
    description: `list all items globally`,
  })
  @ApiOkResponse({
    type: Item,
    isArray: true,
  })
  async getAll(): Promise<Item[]> {
    return this.service.globalFindManyItems();
  }

  @Get('/last')
  @ApiOperation({
    description: `last item globally`,
  })
  @ApiOkResponse({
    type: Item,
  })
  async getLast(): Promise<Item> {
    const item = await this.service.globalFindLastItem();

    // theoretically possible :)
    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @Get('/buckets/:identifier/all')
  @ApiOperation({
    description: `all bucket items`,
  })
  @ApiOkResponse({
    type: Item,
    isArray: true,
  })
  async getBucketAll(@Param() param: IdentifierDTO): Promise<Item[]> {
    return this.service.findManyItems(param);
  }

  @Get('/buckets/:identifier/last')
  @ApiOperation({
    description: `last item in bucket`,
  })
  @ApiOkResponse({
    type: Item,
  })
  async getBucketLast(@Param() param: IdentifierDTO): Promise<Item> {
    const item = await this.service.findLastItem(param);

    if (!item) {
      throw new NotFoundException();
    }

    return item;
  }

  @Post('/buckets/:identifier')
  @ApiOperation({
    description: `add new item to bucket (and create bucket if not exists)`,
  })
  @ApiBody({
    required: true,
    type: 'application/json',
    description: 'any JSON data',
  })
  @ApiOkResponse({
    type: Bucket,
  })
  async postNamespaced(
    @Param() { identifier }: IdentifierDTO,
    @Body() body: any,
  ) {
    return {
      id: this.service.push({ identifier, value: body }),
    };
  }

  @Delete('/buckets/:identifier')
  @ApiOperation({
    description: `delete bucker`,
  })
  async resetNamespace() {
    throw new NotImplementedException();
  }
}
