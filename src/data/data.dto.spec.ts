import { ItemDTO, BucketDTO } from './data.dto';

describe('correct dto serialisation', () => {
  it('serialise item', () => {
    const input = {
      identifier: 'abc',
      value: { message: 'hey' },
    };

    expect(ItemDTO.create(input)).toMatchObject(input);
  });

  it('serialise bucket', () => {
    const input = {
      identifier: 'abc',
      count: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    };

    expect(BucketDTO.create(input)).toMatchObject(input);

    expect(
      BucketDTO.create({ ...input, extraProp: 'ABC' } as any),
    ).toMatchObject(input);
  });

  // TODO: fix serialise
  // it('exclude extra props', () => {
  //   const item = ItemDTO.create({
  //     identifier: 'abc',
  //     value: { message: 'hey' },
  //     something: 'abc',
  //   } as any);

  //   expect((item as any).something).toBeUndefined();
  // });
});
