import { ItemDTO, BucketDTO } from './data.dto';
import { validateSync } from 'class-validator';
import {
  validItem,
  validBucket,
  expectShallowTypes,
  expectValidate,
} from '../../test/utils';
import { toClass } from '../dto/transform';

describe('entity serialisation', () => {
  it('ok serialise item', () => {
    const item = toClass(ItemDTO, validItem);

    expect(item).toMatchObject(validItem);
    expectShallowTypes(item, validItem);
    expectValidate(ItemDTO, validItem);
  });

  it('ok serialise bucket', () => {
    const bucket = toClass(BucketDTO, validBucket);

    expect(bucket).toMatchObject(validBucket);
    expectShallowTypes(bucket, validBucket);
    expectValidate(BucketDTO, validBucket);
  });
});

describe('entity validation > ItemDTO', () => {
  it('ok item', () => {
    const errs = validateSync(toClass(ItemDTO, validItem));

    expect(errs.length).toBe(0);
  });

  it('err mongo id', () => {
    const errs = validateSync(
      toClass(ItemDTO, {
        ...validItem,
        _id: validItem._id.slice(2),
      }),
    );

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('_id');
  });

  it('err date string', () => {
    const errs = validateSync(
      toClass(ItemDTO, {
        ...validItem,
        createdAt: new Date() as any,
      }),
    );

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('createdAt');
  });

  it('err identifier length', () => {
    const errs = validateSync(
      toClass(ItemDTO, {
        ...validItem,
        identifier: 'my-id',
      }),
    );

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('identifier');
  });

  it('err missing identifier', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identifier, ...rest } = validItem;
    const errs = validateSync(toClass(ItemDTO, rest));

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('identifier');
  });

  it('err missing value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, ...rest } = validItem;
    const errs = validateSync(toClass(ItemDTO, rest));

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('value');
  });

  it('err invalid value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, ...rest } = validItem;
    const errs = validateSync(toClass(ItemDTO, { ...rest, value: 'asd' }));

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('value');
  });
});

describe('dto validation > BucketDTO', () => {
  it('ok bucket', () => {
    const errs = validateSync(toClass(BucketDTO, validBucket));

    expect(errs.length).toBe(0);
  });

  it('err count min', () => {
    const errs = validateSync(toClass(BucketDTO, { ...validBucket, count: 0 }));

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('count');
  });

  it('err items length min', () => {
    const errs = validateSync(
      toClass(BucketDTO, { ...validBucket, items: [] }),
    );

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('items');
  });
});
