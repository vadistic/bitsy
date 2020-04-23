import {
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  ArrayMinSize,
  IsEnum,
} from 'class-validator';
import { Type, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  Groups,
  AccessType,
  Default,
  BaseModel,
  ExposeDefault,
} from '../common';
import { itemShallowExample, ItemShallowModel } from '../item/item.model';
import { ObjectId } from 'mongodb';
import { omit } from '../utils';

export const bucketExample: BucketModel = {
  _id: new ObjectId().toHexString(),
  access: AccessType.PUBLIC,
  slug: 'very-mongo-papaya-01',
  count: 1,
  createdAt: new Date().toISOString(),
  updatedAt: null,
  items: [itemShallowExample],
};

export const bucketShallowExample: BucketShallowModel = omit(bucketExample, [
  'items',
]);

// ────────────────────────────────────────────────────────────────────────────────

@Exclude()
export class BucketShallowModel extends BaseModel {
  @ApiProperty({
    description: `unique bucket slug`,
    example: bucketExample.slug,
    type: String,
  })
  @MinLength(12)
  @MaxLength(36)
  @ExposeDefault({ groups: [Groups.MONGO] })
  slug!: string;

  @ApiProperty({
    description: `bucket acesss setting`,
    example: bucketExample.access,
    type: AccessType,
  })
  @Default(() => AccessType.PUBLIC)
  @IsEnum(AccessType)
  @ExposeDefault({ groups: [Groups.MONGO] })
  access!: AccessType;

  @ApiProperty({
    description: `items count in bucket`,
    example: bucketExample.count,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @ExposeDefault()
  count!: number;
}

@Exclude()
export class BucketModel extends BucketShallowModel {
  static collection = 'Buckets';

  @ApiProperty({
    description: `shallow items in bucket`,
    example: bucketExample.items,
    type: ItemShallowModel,
    isArray: true,
  })
  @ArrayMinSize(0)
  @Type(() => ItemShallowModel)
  @ExposeDefault()
  items!: ItemShallowModel[];
}
