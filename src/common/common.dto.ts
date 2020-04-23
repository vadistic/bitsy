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
  IsEnum,
} from 'class-validator';
import { Expose, Type, Exclude, ExposeOptions } from 'class-transformer';
import { TransformDictionary } from './transform-dictionary.decorator';
import { IsNotSiblingOf } from './not-sibling-of.decorator';
import { Default } from './default.decorator';
import { ApiProperty } from '@nestjs/swagger';

export enum Groups {
  MONGO = 'mongo',
  DEFAULT = 'default',
}

export enum AccessType {
  PUBLIC = 'public',
  READONLY = 'readonly',
  WRITEONLY = 'writeonly',
  PRIVATE = 'private',
}

export enum SortDirection {
  ASC = 1,
  DESC = -1,
}

export const ExposeDefault = (options?: ExposeOptions) =>
  Expose({ groups: [Groups.DEFAULT, ...(options?.groups || [])] });

// ────────────────────────────────────────────────────────────────────────────────

@Exclude()
export class IdDTO {
  @IsMongoId()
  @ExposeDefault()
  /** internal mongo objectId */
  _id!: string;
}

@Exclude()
export class ValueDTO {
  @IsNotEmptyObject()
  @ExposeDefault()
  value: any;
}

@Exclude()
export class IdentifierDTO {
  @MinLength(12)
  @MaxLength(36)
  @ExposeDefault()
  /** unique bucket identifier */
  identifier!: string;
}

@Exclude()
export class SlugDTO {
  @MinLength(8)
  @MaxLength(36)
  @ExposeDefault()
  slug!: string;
}

@Exclude()
export class AccessDTO {
  @IsOptional()
  @Default(AccessType.PUBLIC)
  @IsEnum(AccessType)
  @ExposeDefault()
  access!: AccessType;
}

@Exclude()
export class CountDTO {
  @IsNumber()
  @Min(1)
  @ExposeDefault()
  /** count of stuff */
  count!: number;
}

@Exclude()
export class PaginationDTO {
  @ApiProperty({
    enum: ['asc', 'desc', -1, 1],
    default: 'desc',
    example: 'desc',
  })
  @TransformDictionary({ asc: 1, desc: -1, '1': 1, '-1': -1 })
  @IsIn([-1, 1, 'asc', 'desc'])
  @Default(SortDirection.DESC)
  @ExposeDefault()
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
  @ExposeDefault()
  limit!: number;

  @IsOptional()
  @IsMongoId()
  @IsNotSiblingOf(['before'])
  @ExposeDefault()
  after?: string;

  @IsOptional()
  @IsMongoId()
  @IsNotSiblingOf(['after'])
  @ExposeDefault()
  before?: string;
}
