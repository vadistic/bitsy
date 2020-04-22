import { ItemDTO, BucketDTO } from './data.dto';
import { validateSync } from 'class-validator';
import { ObjectId } from 'mongodb';

describe('dto serialisation', () => {
  const date = new Date().toISOString();

  const validItem: ItemDTO = {
    _id: new ObjectId().toHexString(),
    createdAt: date,
    identifier: 'very-mongo-papaya-01',
    value: { message: 'hey' },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, ...validShallowItem } = validItem;

  const validBucket: BucketDTO = {
    identifier: 'very-mongo-papaya-01',
    count: 1,
    createdAt: date,
    updatedAt: date,
    items: [validShallowItem],
  };

  it('ok serialise item', () => {
    const item = ItemDTO.create(validItem);
    expect(item).toMatchObject(validItem);
    expect(Object.keys(item).sort()).toEqual(Object.keys(validItem).sort());
  });

  it('ok serialise bucket', () => {
    const bucket = BucketDTO.create(validBucket);

    expect(bucket).toMatchObject(validBucket);

    expect(Object.keys(bucket).sort()).toEqual(Object.keys(validBucket).sort());
  });

  // ! cannot get classtransformet to work with both exclude& "any" values
  // using custom whitelisting
  it('ok skips extra props', () => {
    const item = ItemDTO.create({ ...validItem, extraProp: 'asd' } as any);
    expect(item).toEqual(validItem);
  });

  it('ok default values', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = validItem;
    const item = ItemDTO.create(rest);

    // shape
    expect(item).toMatchObject({ ...validItem, _id: item._id });
    // add default
    expect(item).toHaveProperty('_id');
    // do not overrride provided
    expect(item.createdAt).toEqual(validBucket.createdAt);
  });
});

describe('dto validation > ItemDTO', () => {
  const validItem = {
    _id: new ObjectId().toHexString(),
    createdAt: new Date().toISOString(),
    identifier: 'very-mongo-papaya-01',
    value: {
      ok: 1,
    },
  };

  it('ok item', () => {
    expect(validateSync(ItemDTO.create(validItem)).length).toBe(0);
  });

  it('err mongo id', () => {
    const errs = validateSync(
      ItemDTO.create({
        ...validItem,
        _id: validItem._id.slice(2),
      }),
    );
    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('_id');
  });

  it('err date string', () => {
    const errs = validateSync(
      ItemDTO.create({
        ...validItem,
        createdAt: new Date() as any,
      }),
    );

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('createdAt');
  });

  it('err identifier length', () => {
    const errs = validateSync(
      ItemDTO.create({
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
    const errs = validateSync(ItemDTO.create(rest as any));
    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('identifier');
  });

  it('err missing value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, ...rest } = validItem;
    const errs = validateSync(ItemDTO.create({ ...rest, value: {} }));
    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('value');
  });

  it('err invalid value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, ...rest } = validItem;
    const errs = validateSync(ItemDTO.create({ ...rest, value: 'asd' }));
    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('value');
  });
});

describe('dto validation > BucketDTO', () => {
  const date = new Date().toISOString();

  const validBucket: BucketDTO = {
    createdAt: date,
    updatedAt: date,
    count: 1,
    identifier: 'my-valid-bucket-id-01',
    items: [
      {
        _id: new ObjectId().toHexString(),
        createdAt: date,
        identifier: 'my-valid-bucket-id-01',
      },
    ],
  };

  it('ok bucket', () => {
    expect(validateSync(BucketDTO.create(validBucket)).length).toBe(0);
  });

  it('err count 0', () => {
    const errs = validateSync(BucketDTO.create({ ...validBucket, count: 0 }));

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('count');
  });

  it('err no items', () => {
    const errs = validateSync(BucketDTO.create({ ...validBucket, items: [] }));

    expect(errs.length).toBe(1);
    expect(errs[0].property).toBe('items');
  });
});
