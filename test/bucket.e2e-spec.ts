import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ItemDTO, BucketDTO } from '../src/data/data.dto';
import {
  expectShallowTypes,
  validItem,
  expectDateSecondsAgo,
  validBucket,
  expectValidate,
} from './utils';

describe('DataController > Bucket (e2e)', () => {
  let app: INestApplication;
  const IDENTIFIER = 'data-service-e2e-01';

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

  // ────────────────────────────────────────────────────────────────────────────────
  const data = { works: true, nested: { hello: 'world' } };

  it(`POST /api/buckets/:identifier ok`, () => {
    return request(app.getHttpServer())
      .post(`/api/buckets/${IDENTIFIER}`)
      .send(data)
      .expect(201)
      .then((res) => {
        const item: ItemDTO = res.body;

        expectShallowTypes(item, validItem);
        expectDateSecondsAgo(item.createdAt, 10);
      });
  });

  it(`POST /api/buckets/:identifier err too short`, () => {
    return request(app.getHttpServer())
      .post(`/api/buckets/abc`)
      .send(data)
      .expect(400)
      .then((res) => {
        expect(res.body).toMatchInlineSnapshot(`
          Object {
            "error": "Bad Request",
            "message": Array [
              "identifier must be longer than or equal to 12 characters",
            ],
            "statusCode": 400,
          }
        `);
      });
  });

  it('GET /api/buckets/:identifier ok', () => {
    return request(app.getHttpServer())
      .get(`/api/buckets/${IDENTIFIER}`)
      .expect(200)
      .then((res) => {
        const bucket: BucketDTO = res.body;

        expectShallowTypes(bucket, validBucket);
        expectValidate(BucketDTO, bucket);
      });
  });

  // ────────────────────────────────────────────────────────────────────────────────

  it('GET /api/buckets/:identifier/last ok', () => {
    return request(app.getHttpServer())
      .get(`/api/buckets/${IDENTIFIER}/last`)
      .expect(200)
      .then((res) => {
        const item: ItemDTO = res.body;

        expectShallowTypes(item, validItem);
        expectValidate(ItemDTO, item);
      });
  });
});
