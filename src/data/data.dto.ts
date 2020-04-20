import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import {} from 'class-transformer';
import { serialise } from '../utils';

type MarkRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type MarkPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// doc stored in database
export class ItemDTO {
  @ApiProperty({
    description: `internal mongo objectId`,
  })
  _id!: string;

  @ApiProperty({
    description: `create date`,
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    description: `unique bucket identifier`,
  })
  identifier!: string;

  @ApiProperty({
    description: `any arbitrary JSON data`,
    type: {},
  })
  value!: any;

  // TODO: how to class transofrmers defaults?
  static create({
    _id = new ObjectId().toHexString(),
    createdAt = new Date().toISOString(),
    identifier,
    value,
  }: MarkRequired<ItemDTO, 'identifier' | 'value'>) {
    return serialise(ItemDTO, { _id, createdAt, identifier, value });
  }
}

// ────────────────────────────────────────────────────────────────────────────────

export class ItemShallowDTO extends OmitType(ItemDTO, ['value']) {}

// virtual - not stored in db
export class BucketDTO {
  @ApiProperty({
    description: `create date`,
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    description: `update date`,
    format: 'date-time',
  })
  updatedAt!: string;

  @ApiProperty({
    description: `unique bucket identifier`,
  })
  identifier!: string;

  @ApiProperty({
    description: `items count in bucket`,
  })
  count!: number;

  @ApiProperty({
    description: `(shallow) items in bucket`,
    type: () => ItemShallowDTO,
    isArray: true,
  })
  items!: ItemShallowDTO[];

  static create({ count, createdAt, identifier, items, updatedAt }: BucketDTO) {
    return serialise(BucketDTO, {
      count,
      createdAt,
      identifier,
      items,
      updatedAt,
    });
  }
}

export class BucketShallowDTO extends OmitType(BucketDTO, ['items']) {}

// ────────────────────────────────────────────────────────────────────────────────

export class UniqueDTO {
  @ApiProperty({
    description: `internal mongo objectId`,
  })
  _id!: string;
}

export class ValueDTO {
  @ApiProperty({
    description: `any arbitrary JSON data`,
  })
  value: any;
}

export class IdentifierDTO {
  @ApiProperty({
    description: `unique bucket identifier`,
  })
  identifier!: string;
}

export class CountDTO {
  @ApiProperty({
    description: `counts stuff`,
  })
  count!: number;
}

// export class BucketShallowDTO extends OmitType(Bucket, ['items']) {}

// TODO: DTO follwing JSON API standard
// https://jsonapi.org/
