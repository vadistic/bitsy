import {
  BucketDTO,
  ItemDTO,
  BucketShallowDTO,
  ItemShallowDTO,
} from '../src/data/data.dto';
import { ObjectId } from 'mongodb';
import { validateSync } from 'class-validator';
import { toClass } from '../src/dto/transform';
import { SortDirection } from '../src/dto/common.dto';

const date = new Date().toISOString();

export const validItem: ItemDTO = {
  _id: new ObjectId().toHexString(),
  createdAt: date,
  identifier: 'very-mongo-papaya-01',
  value: { message: 'hey' },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { value, ..._validItemShallow } = validItem;

export const validItemShallow: ItemShallowDTO = _validItemShallow;

export const validBucket: BucketDTO = {
  identifier: 'very-mongo-papaya-01',
  count: 1,
  createdAt: date,
  updatedAt: date,
  items: [validItemShallow],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { items, ..._validBucketShallow } = validBucket;

export const validBucketShallow: BucketShallowDTO = _validBucketShallow;

// ────────────────────────────────────────────────────────────────────────────────

export const expectShallowTypes = (objA: any, objB: any) => {
  if (!objA || !objB) {
    // need error
    expect(objA).toMatchObject(objB);
  }

  const keysA = Object.keys(objA).sort();
  const keysB = Object.keys(objB).sort();
  // names
  expect(keysA).toEqual(keysB);
  // types
  expect(keysA.map((key) => [key, typeof objA[key]])).toEqual(
    keysB.map((key) => [key, typeof objB[key]]),
  );
};

export const expectValidate = (ref: any, obj: any) => {
  const errs = validateSync(toClass(ref, obj));

  expect(errs).toEqual([]);
};

export const expectDateSecondsAgo = (date: Date | string, seconds: number) => {
  const ago = Date.now() - seconds * 1000;

  expect(new Date(date).getTime() > ago).toBeTruthy();
};

export const expectSorted = (dir: SortDirection, arr: any[]) => {
  const sorted = arr.sort((a, b) => (a._id > b._id ? dir : -dir));
  expect(sorted).toEqual(arr);
};
