import {
  IsMongoId,
  IsNotEmptyObject,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsEnum,
  IsInt,
  Max,
  IsOptional,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { TransformDictionary } from './transform-dictionary.decorator';
import { IsNotSiblingOf } from './not-sibling-of.decorator';
import { Default } from './default.decorator';

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
  @TransformDictionary({ asc: 1, desc: -1 })
  @Default(SortDirection.DESC)
  @IsEnum(SortDirection)
  @Expose()
  /** sort by mongo id direcction */
  sort!: SortDirection;

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
