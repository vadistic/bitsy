import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DataService } from './data.service';
import { ItemDTO, IdentifierDTO, BucketDTO, CountDTO } from './data.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';

@Controller('/api')
@UsePipes(ValidationPipe)
@ApiTags('buckets')
export class DataController {
  constructor(
    private readonly service: DataService,
    private readonly logger: LoggerService,
  ) {}

  // ────────────────────────────────────────────────────────────────────────────────

  @Get('/buckets/:identifier')
  @ApiOkResponse({ type: BucketDTO })
  @ApiNotFoundResponse({ type: IdentifierDTO })
  async getBucket(@Param() param: IdentifierDTO): Promise<BucketDTO> {
    const bucket = await this.service.findOneBucket(param);

    if (!bucket) {
      throw new NotFoundException(param);
    }

    return bucket;
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Get('/buckets/:identifier/last')
  @ApiOkResponse({ type: ItemDTO })
  async getLastBucketItem(@Param() param: IdentifierDTO): Promise<ItemDTO> {
    const item = await this.service.findLastItem(param);

    if (!item) {
      throw new NotFoundException(param);
    }

    return item;
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Get('/buckets/:identifier/items')
  @ApiOkResponse({ type: ItemDTO, isArray: true })
  async getBucketItems(@Param() param: IdentifierDTO): Promise<ItemDTO[]> {
    return this.service.findManyItems(param);
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Post('/buckets/new')
  @ApiBody({ required: true, description: 'JSON' })
  @ApiOkResponse({ type: ItemDTO })
  async postNew(@Body() body: any): Promise<ItemDTO> {
    return this.service.pushToBucket({ value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Post('/buckets/:identifier')
  @ApiBody({ required: true, description: 'JSON' })
  @ApiOkResponse({ type: ItemDTO })
  async postPush(
    @Param() param: IdentifierDTO,
    @Body() body: any,
  ): Promise<ItemDTO> {
    return this.service.pushToBucket({ ...param, value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Put('/buckets/:identifier')
  @ApiOkResponse({ type: ItemDTO })
  async putBucket(
    @Param() param: IdentifierDTO,
    @Body() body: any,
  ): Promise<ItemDTO> {
    await this.service.deleteBucket(param);
    return this.service.pushToBucket({ ...param, value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Delete('/buckets/:identifier')
  @ApiOkResponse({ type: CountDTO })
  async deleteBucket(@Param() param: IdentifierDTO): Promise<CountDTO> {
    return this.service.deleteBucket(param);
  }
}
