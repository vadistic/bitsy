import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  SlugDTO,
  NotFoundInterceptor,
  TimeoutInterceptor,
  AccessDTO,
} from '../common';
import { BucketService } from './bucket.service';
import { BucketModel } from './bucket.model';
import { ApiBody } from '@nestjs/swagger';
import { SlugService } from './slug.service';

@Controller('api/v2/buckets')
@UseInterceptors(NotFoundInterceptor, TimeoutInterceptor)
export class BucketController {
  constructor(
    private readonly service: BucketService,
    private readonly slugService: SlugService,
  ) {}

  @Post('/')
  @ApiBody({ type: Object })
  async postBucket(
    @Query() { access }: AccessDTO,
    @Body() value: any,
  ): Promise<BucketModel> {
    const slug = await this.slugService.generateUnique();
    return this.service.createBucket({ slug, access, value });
  }

  @Get('/:slug')
  async getBucket(@Param() { slug }: SlugDTO): Promise<BucketModel | null> {
    return this.service.getBucket({ slug });
  }
}
