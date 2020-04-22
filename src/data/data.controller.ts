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
  Query,
} from '@nestjs/common';
import { DataService } from './data.service';
import { ItemDTO, BucketDTO } from './data.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiBody,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { IdentifierDTO, PaginationDTO, CountDTO } from '../dto/common.dto';
import { CustomValidationPipe } from '../dto/transform';

@Controller('/api')
@UsePipes(CustomValidationPipe)
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
  @ApiNotFoundResponse({ type: IdentifierDTO })
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
  @ApiNotFoundResponse({ type: IdentifierDTO })
  async getBucketItems(
    @Param() param: IdentifierDTO,
    @Query() query: PaginationDTO,
  ): Promise<ItemDTO[]> {
    const items = await this.service.findManyItems({ ...param, ...query });

    if (!items.length) {
      throw new NotFoundException(param);
    }

    return this.service.findManyItems({ ...param, ...query });
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
  @ApiNotFoundResponse({ type: IdentifierDTO })
  async putBucket(
    @Param() param: IdentifierDTO,
    @Body() body: any,
  ): Promise<ItemDTO> {
    const deleted = await this.service.deleteBucket(param);

    if (deleted.count === 0) {
      throw new NotFoundException(param);
    }

    return this.service.pushToBucket({ ...param, value: body });
  }

  // ────────────────────────────────────────────────────────────────────────────────

  @Delete('/buckets/:identifier')
  @ApiOkResponse({ type: CountDTO })
  @ApiNotFoundResponse({ type: IdentifierDTO })
  async deleteBucket(@Param() param: IdentifierDTO): Promise<CountDTO> {
    const deleted = await this.service.deleteBucket(param);

    if (deleted.count === 0) {
      throw new NotFoundException(param);
    }

    return deleted;
  }
}
