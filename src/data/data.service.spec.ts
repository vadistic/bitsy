import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';
import {
  expectShallowTypes,
  validItem,
  validItemShallow,
  expectSorted,
} from '../../test/utils';
import { SortDirection } from '../dto/common.dto';
import { DataModule } from './data.module';

describe('DataService', () => {
  let service: DataService;
  let mod: TestingModule;

  const IDENTIFIER = 'data-service-test-02';

  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule, DataModule],
    }).compile();

    service = mod.get<DataService>(DataService);
  });

  afterAll(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creation', () => {
    it('should push to existing bucket', async () => {
      const value = { message: 'Push to existing', when: new Date() };

      const item = await service.pushToBucket({
        identifier: IDENTIFIER,
        value,
      });

      const last = await service.findLastItem({ identifier: IDENTIFIER });

      expectShallowTypes(item, validItem);
      expect(last).toMatchObject({ value });
      expect(item).toMatchObject({ value });
      expect(item).toEqual(last);
    });

    it('should push to new bucket', async () => {
      const value = { message: 'Push to new', when: new Date() };

      const item = await service.pushToBucket({
        value,
      });

      const last = await service.findLastItem({
        identifier: item.identifier,
      });

      expectShallowTypes(item, validItem);
      expect(last).toMatchObject({ value });
      expect(item).toMatchObject({ value });
      expect(item).toEqual(last);
    });
  });

  describe('aggregation', () => {
    it('should aggregate bucket', async () => {
      const identifier = 'data-service-test-01';

      const all = await service.findManyItems({ identifier });
      const bucket = await service.findOneBucket({ identifier });

      all.forEach((item) => {
        expectShallowTypes(item, validItem);
      });

      bucket?.items.forEach((itemShallow) => {
        expectShallowTypes(itemShallow, validItemShallow);
      });

      // length
      expect(all.length).toBe(bucket?.count);
      expect(all.length).toBe(bucket?.items.length);

      // it's shallow
      expect(bucket?.items[0]).not.toHaveProperty('value');
    });
  });

  describe('pagination', () => {
    it('should sort items descending', async () => {
      const items = await service.findManyItems({
        identifier: IDENTIFIER,
        sort: SortDirection.DESC,
      });

      expectSorted(SortDirection.DESC, items);
    });

    it('should sort items ascending', async () => {
      const items = await service.findManyItems({
        identifier: IDENTIFIER,
        sort: SortDirection.ASC,
      });

      expectSorted(SortDirection.ASC, items);
    });

    it('should respect limit', async () => {
      const items = await service.findManyItems({
        identifier: IDENTIFIER,
        sort: SortDirection.DESC,
        limit: 2,
      });

      expect(items.length).toBeLessThanOrEqual(2);
    });
  });
});
