import { OmitType } from '@nestjs/swagger';
import { Serialisable } from '../utils';
import {
  IsDateString,
  MinLength,
  MaxLength,
  IsMongoId,
  IsNotEmptyObject,
  IsNumber,
  Min,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsInt,
  Max,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { Transform, Type } from 'class-transformer';

// doc stored in database
export class ItemDTO extends Serialisable<ItemDTO, '_id' | 'createdAt'>() {
  /** internal mongodb id */
  @IsMongoId()
  _id: string = new ObjectId().toHexString();

  /** create date */
  @IsDateString()
  createdAt: string = new Date().toISOString();

  /** unique bucket identifier */
  @MinLength(12)
  @MaxLength(36)
  identifier!: string;

  /** arbitrary JSON data */
  @IsNotEmptyObject()
  value!: any;

  static whitelist: (keyof ItemDTO)[] = [
    '_id',
    'createdAt',
    'identifier',
    'value',
  ];
}

// ────────────────────────────────────────────────────────────────────────────────

export class ItemShallowDTO extends OmitType(ItemDTO, ['value']) {}

// virtual - not stored in db
export class BucketDTO extends Serialisable<BucketDTO>() {
  @IsDateString()
  /** create date */
  createdAt!: string;

  @IsDateString()
  /** update date */
  updatedAt!: string;

  @MinLength(12)
  @MaxLength(36)
  /** unique bucket identifier */
  identifier!: string;

  @IsNumber()
  @Min(1)
  /** items count in bucket */
  count!: number;

  @ArrayMinSize(1)
  @Type(() => ItemShallowDTO)
  /** shallow items in bucket */
  items!: ItemShallowDTO[];

  static whitelist: (keyof BucketDTO)[] = [
    'createdAt',
    'updatedAt',
    'identifier',
    'count',
    'items',
  ];
}

export class BucketShallowDTO extends OmitType(BucketDTO, ['items']) {}

// ────────────────────────────────────────────────────────────────────────────────

export class UniqueDTO extends Serialisable<UniqueDTO>() {
  @IsMongoId()
  /** internal mongo objectId */
  _id!: string;
}

export class ValueDTO extends Serialisable<ValueDTO>() {
  @IsNotEmptyObject()
  /** any arbitrary JSON data */
  value: any;
}

export class IdentifierDTO extends Serialisable<IdentifierDTO>() {
  @MinLength(12)
  @MaxLength(36)
  /** unique bucket identifier */
  identifier!: string;
}

export class CountDTO extends Serialisable<CountDTO>() {
  @IsNumber()
  @Min(1)
  /** count of stuff */
  count!: number;
}

export enum SortType {
  ASC = 1,
  DESC = -1,
  OFF = 0,
}

export class SortDTO extends Serialisable<SortDTO>() {
  @Transform((val) => (val === 'asc' ? 1 : val == 'desc' ? -1 : val))
  @IsEnum(SortType)
  /** sort by mongo id direcction */
  sort!: number;
}

export class PaginationDTO extends Serialisable<PaginationDTO>() {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsMongoId()
  after?: string;

  @IsOptional()
  @IsMongoId()
  before?: string;
}
