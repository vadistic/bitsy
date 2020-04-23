import { toClass, toMongo } from '../common/transform';
import {
  BucketModel,
  bucketExample,
  BucketShallowModel,
  bucketShallowExample,
} from './bucket.model';
import { validateSync } from 'class-validator';
import { Groups } from '../common';
import { omit } from '../utils';

describe('BucketModel serialisation', () => {
  it('to class', () => {
    const clz = toClass(BucketModel, bucketExample);
    expect(clz).toBeValid();
    expect(clz).toEqualTypes(bucketExample);
  });

  it('to mongo', () => {
    const clz = toMongo<Partial<BucketModel>>(BucketModel, bucketExample);

    expect(validateSync(clz, { groups: [Groups.MONGO] })).toBeValid();
    expect(clz).toEqualTypes(omit(bucketExample, ['count', 'items']));
  });

  it('skips extra props', () => {
    const clz = toClass(BucketModel, { ...bucketExample, something: 'asd' });
    expect(clz).toBeValid();
    expect(clz).toEqualTypes(bucketExample);
  });

  it('shallow', () => {
    const clz = toClass(BucketShallowModel, bucketExample);

    expect(clz).toBeValid();
    expect(clz).toEqualTypes(bucketShallowExample);
  });
});
