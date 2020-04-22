import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { expectShallowTypes, validItem, expectValidate } from './utils';
import { ItemDTO } from '../src/data/data.dto';

describe('DataController > Item (e2e)', () => {
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

  // ────────────────────────────────────────────────────────────────────────────────

  it('GET /api/buckets/:identifier/items ok', () => {
    return (
      request(app.getHttpServer())
        .get(`/api/buckets/${IDENTIFIER}/items`)
        // .expect(200)
        .then((res) => {
          const item: ItemDTO = res.body[0];

          expectShallowTypes(item, validItem);
          expectValidate(ItemDTO, item);

          expect(res.body.length).toBe(10);
        })
    );
  });

  it('GET /api/buckets/:identifier/items?limit=2 ok limit', () => {
    return request(app.getHttpServer())
      .get(`/api/buckets/${IDENTIFIER}/items?limit=2`)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(2);
      });
  });

  it('GET /api/buckets/:identifier/items?limit=200 err too many', () => {
    return request(app.getHttpServer())
      .get(`/api/buckets/${IDENTIFIER}/items?limit=200`)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toMatchInlineSnapshot(`
          Array [
            "limit must not be greater than 100",
          ]
        `);
      });
  });

  it('GET /api/buckets/:identifier/items?asd=asd&limit=1 ok extra query', () => {
    return request(app.getHttpServer())
      .get(`/api/buckets/${IDENTIFIER}/items?asd=asd&limit=1`)
      .expect(200);
  });
});
