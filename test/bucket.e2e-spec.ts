import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { bucketExample, BucketModel } from '../src/bucket';

describe('BucketController (e2e)', () => {
  let app: INestApplication;
  const SLUG = 'data-service-e2e-02';

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

  it(`POST /api/v2/buckets/:slug ok`, () => {
    return request(app.getHttpServer())
      .post(`/api/v2/buckets`)
      .send(data)
      .expect(201)
      .then((res) => {
        expect(res.body).toBeValid(BucketModel);
        expect(res.body).toEqualTypes(bucketExample);
      });
  });
});
