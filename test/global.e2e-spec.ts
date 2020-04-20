import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BucketShallowDTO, BucketDTO } from 'src/data/data.dto';

describe('DataController (e2e)', () => {
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

  it('GET /api/global', () => {
    return request(app.getHttpServer())
      .get('/api/global')
      .expect(200)
      .then((res) => {
        const b: BucketShallowDTO = res.body[0];
        expect(typeof b.count).toBe('number');
        expect(typeof b.identifier).toBe('string');
        expect(b.createdAt).toBeDefined();

        expect(b).not.toHaveProperty('items');
      });
  });

  it('GET /api/global/last', () => {
    return request(app.getHttpServer())
      .get('/api/global/last')
      .expect(200)
      .then((res) => {
        const b: BucketDTO = res.body;
        expect(typeof b.count).toBe('number');
        expect(typeof b.identifier).toBe('string');
        expect(b.createdAt).toBeDefined();

        expect(b.items.length).toBeGreaterThanOrEqual(1);

        expect(b.items[0].identifier).toBe(b.identifier);
      });
  });

  it('GET /api/global/items', () => {
    return request(app.getHttpServer())
      .get('/api/global/last')
      .expect(200)
      .then((res) => {
        const b: BucketDTO = res.body;
        expect(typeof b.count).toBe('number');
        expect(typeof b.identifier).toBe('string');
        expect(b.createdAt).toBeDefined();

        expect(b.items.length).toBeGreaterThanOrEqual(1);

        expect(b.items[0].identifier).toBe(b.identifier);
      });
  });
});
