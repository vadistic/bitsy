import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

// virtual - not stored in db
export class Bucket {
  @ApiProperty({
    description: `create date`,
  })
  createdAt!: Date;

  @ApiProperty({
    description: `update date`,
  })
  updatedAt!: Date;

  @ApiProperty({
    description: `unique bucket identifier`,
  })
  identifier!: string;

  @ApiProperty({
    description: `all bucket items`,
  })
  items!: Item[];
}

// doc stored in database
export class Item {
  @ApiProperty({
    description: `internal mongo objectId`,
  })
  _id: string = new ObjectId().toHexString();

  @ApiProperty({
    description: `create date`,
  })
  createdAt: Date = new Date();

  @ApiProperty({
    description: `unique bucket identifier`,
  })
  identifier: string;

  @ApiProperty({
    description: `any arbitrary JSON data`,
  })
  value: any;

  constructor(identifier: string, value: any) {
    this.identifier = identifier;
    this.value = value;
  }

  static create(input: IdentifierDTO & ValueDTO) {
    return new Item(input.identifier, input.value);
  }
}

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

export class BucketShallowDTO extends OmitType(Bucket, ['items']) {}

// TODO: DTO follwing JSON API standard
// https://jsonapi.org/
