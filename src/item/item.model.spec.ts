import { toClass, toMongo } from '../common';
import {
  ItemModel,
  itemExample,
  itemShallowExample,
  ItemShallowModel,
} from './item.model';

describe('ItemModel serialisation', () => {
  it('to class', () => {
    const clz = toClass(ItemModel, itemExample);
    expect(clz).toBeValid();
    expect(clz).toEqualTypes(itemExample);
  });

  it('to mongo', () => {
    const clz = toMongo(ItemModel, itemExample);
    expect(clz).toBeValid();
    expect(clz).toEqualTypes(itemExample);
  });

  it('skips extra props', () => {
    const clz = toClass(ItemModel, { ...itemExample, something: 'asd' });
    expect(clz).toBeValid();
    expect(clz).toEqualTypes(itemExample);
  });

  it('shallow', () => {
    const clz = toClass(ItemShallowModel, itemExample);

    expect(clz).toBeValid();
    expect(clz).toEqualTypes(itemShallowExample);
  });
});
