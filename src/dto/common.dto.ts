import {
  IsMongoId,
  IsNotEmptyObject,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  Max,
  IsOptional,
  IsIn,
  IsNumberString,
} from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';
import { TransformDictionary } from './transform-dictionary.decorator';
import { IsNotSiblingOf } from './not-sibling-of.decorator';
import { Default } from './default.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class IdDTO {
  @IsMongoId()
  /** internal mongo objectId */
  _id!: string;
}

export class ValueDTO {
  @IsNotEmptyObject()
  value: any;
}

export class IdentifierDTO {
  @ApiProperty({
    example: 'my-cool-bucket-01',
  })
  @MinLength(12)
  @MaxLength(36)
  @Expose()
  /** unique bucket identifier */
  identifier!: string;
}

export class CountDTO {
  @IsNumber()
  @Min(1)
  /** count of stuff */
  count!: number;
}

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}

export class PaginationDTO {
  @ApiProperty({
    enum: ['asc', 'desc', -1, 1],
    default: 'desc',
    example: 'desc',
  })
  @TransformDictionary({ asc: 1, desc: -1, '1': 1, '-1': -1 })
  @IsIn([-1, 1, 'asc', 'desc'])
  @Default(SortDirection.DESC)
  @Expose()
  /** sort by mongo id direcction */
  sort!: SortDirection;

  @ApiProperty({
    default: 10,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @Type(() => Number)
  @Default(10)
  @IsInt()
  @Min(0)
  @Max(100)
  @Expose()
  limit!: number;

  @IsOptional()
  @IsMongoId()
  @IsNotSiblingOf(['before'])
  @Expose()
  after?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotSiblingOf(['after'])
  @Expose()
  before?: string;
}
