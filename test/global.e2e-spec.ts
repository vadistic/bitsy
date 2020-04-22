import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  BucketShallowDTO,
  ItemDTO,
  ItemShallowDTO,
} from '../src/data/data.dto';
import {
  expectShallowTypes,
  expectValidate,
  validItem,
  validBucketShallow,
  validItemShallow,
  expectSorted,
} from './utils';
import { SortDirection } from '../src/dto/common.dto';

describe('GlobalController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/global ok', () => {
    return request(app.getHttpServer())
      .get('/api/global')
      .expect(200)
      .then((res) => {
        const bucket: BucketShallowDTO = res.body[0];

        expectShallowTypes(bucket, validBucketShallow);
        expectValidate(BucketShallowDTO, bucket);
      });
  });

  it('GET /api/global?sort=asc&limit=4 ok', () => {
    return request(app.getHttpServer())
      .get('/api/global?sort=asc&limit=4')
      .expect(200)
      .then((res) => {
        const buckets: BucketShallowDTO[] = res.body;

        expectSorted(SortDirection.ASC, buckets);
        expect(buckets.length).toBeLessThanOrEqual(4);
      });
  });

  it('GET /api/global/last', () => {
    return request(app.getHttpServer())
      .get('/api/global/last')
      .expect(200)
      .then((res) => {
        const item: ItemDTO = res.body;

        expectShallowTypes(item, validItem);
        expectValidate(ItemDTO, item);
      });
  });

  it('GET /api/global/items', () => {
    return request(app.getHttpServer())
      .get('/api/global/items')
      .expect(200)
      .then((res) => {
        const items: ItemShallowDTO[] = res.body;

        expectShallowTypes(items[0], validItemShallow);
        expectValidate(ItemShallowDTO, items[0]);
      });
  });
});
