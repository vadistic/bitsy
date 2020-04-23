import { MinLength, MaxLength, IsNotEmptyObject } from 'class-validator';
import { Groups, ExposeDefault } from '../common/common.dto';
import { BaseModel } from '../common';
import { omit } from '../utils';
import { ObjectId } from 'mongodb';
import { Exclude } from 'class-transformer';

@Exclude()
export class ItemShallowModel extends BaseModel {
  @MinLength(12)
  @MaxLength(36)
  @ExposeDefault({ groups: [Groups.MONGO] })
  /** unique bucket slug */
  slug!: string;
}

@Exclude()
export class ItemModel extends ItemShallowModel {
  static collection = 'Items';

  @IsNotEmptyObject()
  @ExposeDefault({ groups: [Groups.MONGO] })
  /** arbitrary JSON data */
  value!: any;
}

// ────────────────────────────────────────────────────────────────────────────────

export const itemExample: ItemModel = {
  _id: new ObjectId().toHexString(),
  createdAt: new Date().toISOString(),
  updatedAt: null,
  slug: 'very-mongo-papaya-01',
  value: { message: 'hey' },
};

export const itemShallowExample: ItemShallowModel = omit(itemExample, [
  'value',
]);
