import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BucketDTO, ItemDTO } from '../src/data/data.dto';

const lessThan2MinutesAgo = (date: Date | string) => {
  const twoMinAgo = Date.now() - 5 * 1000;

  return new Date(date).getTime() > twoMinAgo;
};

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

  it('POST /api/buckets/data-service-e2e-01', () => {
    const data = { name: 'Jakub', isItWorking: true };

    return request(app.getHttpServer())
      .post('/api/buckets/data-service-e2e-01')
      .send(data)
      .expect(201)
      .then((res) => {
        const item: ItemDTO = res.body;

        // correct fields
        expect(item).toMatchObject(ItemDTO.create(item));
        expect(item.value).toMatchObject(data);

        expect(lessThan2MinutesAgo(item.createdAt)).toBeTruthy();
      });
  });

  it('GET /api/buckets/data-service-e2e-01', () => {
    return request(app.getHttpServer())
      .get('/api/buckets/data-service-e2e-01')
      .expect(200)
      .then((res) => {
        const bucket: BucketDTO = res.body;

        expect(bucket).toMatchObject(BucketDTO.create(bucket));

        expect(typeof bucket.count).toBe('number');
        expect(typeof bucket.identifier).toBe('string');
        expect(bucket.createdAt).toBeDefined();

        expect(bucket).toHaveProperty('items');
      });
  });

  it('GET /api/buckets/data-service-e2e-01/last', () => {
    return request(app.getHttpServer())
      .get('/api/buckets/data-service-e2e-01/last')
      .expect(200)
      .then((res) => {
        const item: ItemDTO = res.body;

        expect(item).toMatchObject(ItemDTO.create(item));
      });
  });
});
