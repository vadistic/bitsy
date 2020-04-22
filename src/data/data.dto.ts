import { OmitType } from '@nestjs/swagger';
import {
  IsDateString,
  MinLength,
  MaxLength,
  IsMongoId,
  IsNotEmptyObject,
  IsNumber,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { Type, Expose } from 'class-transformer';
import { Default } from '../dto/default.decorator';

// doc stored in database
export class ItemDTO {
  @IsMongoId()
  @Default(() => new ObjectId().toHexString())
  @Expose()
  /** internal mongodb id */
  _id!: string;

  @IsDateString()
  @Default(() => new Date().toISOString())
  @Expose()
  /** create date */
  createdAt!: string;

  @MinLength(12)
  @MaxLength(36)
  @Expose()
  /** unique bucket identifier */
  identifier!: string;

  @IsNotEmptyObject()
  @Expose()
  /** arbitrary JSON data */
  value!: any;
}

// ────────────────────────────────────────────────────────────────────────────────

export class ItemShallowDTO extends OmitType(ItemDTO, ['value']) {}

// virtual - not stored in db
export class BucketDTO {
  @IsDateString()
  @Expose()
  /** create date */
  createdAt!: string;

  @IsDateString()
  @Expose()
  /** update date */
  updatedAt!: string;

  @MinLength(12)
  @MaxLength(36)
  @Expose()
  /** unique bucket identifier */
  identifier!: string;

  @IsNumber()
  @Min(1)
  @Expose()
  /** items count in bucket */
  count!: number;

  @ArrayMinSize(1)
  @Type(() => ItemShallowDTO)
  @Expose()
  /** shallow items in bucket */
  items!: ItemShallowDTO[];
}

export class BucketShallowDTO extends OmitType(BucketDTO, ['items']) {}
