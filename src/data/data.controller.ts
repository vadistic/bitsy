import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { DataService } from './data.service';
import { ItemDTO, IdentifierDTO, BucketDTO, CountDTO } from './data.dto';
import { ApiOkResponse, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('/api')
@ApiTags('buckets')
export class DataController {
  constructor(private readonly service: DataService) {}

  // ────────────────────────────────────────────────────────────────────────────────

  @Get('/buckets/:identifier')
  @ApiOperation({
    description: `get bucket`,
  })
  @ApiOkResponse({
    type: BucketDTO,
  })
  async getBucket(@Param() param: IdentifierDTO): Promise<BucketDTO> {
    const bucket = await this.service.findOneBucket(param);

    if (!bucket) {
      throw new NotFoundException(param);
    }

    return bucket;
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Get('/buckets/:identifier/last')
  @ApiOperation({
    description: `last item in bucket`,
  })
  @ApiOkResponse({
    type: ItemDTO,
  })
  async getLastBucketItem(@Param() param: IdentifierDTO): Promise<ItemDTO> {
    const item = await this.service.findLastItem(param);

    if (!item) {
      throw new NotFoundException(param);
    }

    return item;
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Get('/buckets/:identifier/items')
  @ApiOperation({
    description: `get items in bucket`,
  })
  @ApiOkResponse({
    type: ItemDTO,
    isArray: true,
  })
  async getBucketItems(@Param() param: IdentifierDTO): Promise<ItemDTO[]> {
    return this.service.findManyItems(param);
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Post('/buckets/new')
  @ApiOperation({
    description: `create new bucket by pushing first item\n\nit will generate cool & safe identifier`,
  })
  @ApiBody({
    required: true,
    type: 'object',
    description: 'any JSON data',
  })
  @ApiOkResponse({
    type: ItemDTO,
  })
  async postNew(@Body() body: any): Promise<ItemDTO> {
    return this.service.pushToBucket({ value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Post('/buckets/:identifier')
  @ApiOperation({
    description: `add new item to bucket (dynamically create bucket if not exists)`,
  })
  @ApiBody({
    required: true,
    type: 'application/json',
    description: 'any JSON data',
  })
  @ApiOkResponse({
    type: ItemDTO,
  })
  async postPush(
    @Param() param: IdentifierDTO,
    @Body() body: any,
  ): Promise<ItemDTO> {
    return this.service.pushToBucket({ ...param, value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Put('/buckets/:identifier')
  @ApiOperation({
    description: `overwrite bucket with new data (this delete previous items)`,
  })
  async putBucket(
    @Param() param: IdentifierDTO,
    @Body() body: any,
  ): Promise<ItemDTO> {
    await this.service.deleteBucket(param);
    return this.service.pushToBucket({ ...param, value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Delete('/buckets/:identifier')
  @ApiOperation({
    description: `delete bucket`,
  })
  async deleteBucket(@Param() param: IdentifierDTO): Promise<CountDTO> {
    return this.service.deleteBucket(param);
  }
}
