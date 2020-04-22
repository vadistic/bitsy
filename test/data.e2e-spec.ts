import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ItemDTO } from '../src/data/data.dto';
import {
  expectEqualTypes,
  validItem,
  expectDateSecondsAgo,
  validBucket,
} from './utils';

describe('DataController (e2e)', () => {
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

  it(`POST /api/buckets/:identifier ok`, () => {
    const data = { works: true, nested: { hello: 'world' } };

    return request(app.getHttpServer())
      .post(`/api/buckets/${IDENTIFIER}`)
      .send(data)
      .expect(201)
      .then((res) => {
        const item: ItemDTO = res.body;

        expectEqualTypes(item, validItem);
        expectDateSecondsAgo(item.createdAt, 10);
      });
  });

  it(`POST /api/buckets/:identifier err too short`, () => {
    const data = { works: true, nested: { hello: 'world' } };

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
      .get(`/api/buckets/data-service-e2e-01`)
      .expect(200)
      .then((res) => expectEqualTypes(res.body, validBucket));
  });

  // ────────────────────────────────────────────────────────────────────────────────

  it('GET /api/buckets/:identifier/last ok', () => {
    return request(app.getHttpServer())
      .get(`/api/buckets/${IDENTIFIER}/last`)
      .expect(200)
      .then((res) => expectEqualTypes(res.body, validItem));
  });
});
