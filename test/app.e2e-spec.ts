import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { BucketShallowDTO } from 'src/data/data.dto';

describe('AppController (e2e)', () => {
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

  it('GET /api/hello', () => {
    return request(app.getHttpServer())
      .get('/api/hello')
      .expect(200)
      .expect({ message: 'Hello World!' });
  });

  it('GET /api/hello?name=""', () => {
    return request(app.getHttpServer())
      .get('/api/hello?name=Jakub')
      .expect(200)
      .expect({ message: 'Hello Jakub!' });
  });

  it('POST /api/message ok', () => {
    return request(app.getHttpServer())
      .post('/api/message')
      .send({ message: 'abc' })
      .expect(HttpStatus.CREATED)
      .expect({ message: 'abc' });
  });

  it('POST /api/message bad request', () => {
    return request(app.getHttpServer())
      .post('/api/message')
      .send({ message: { nested: 'asd' } })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('POST /api/message extra prop ok', () => {
    return request(app.getHttpServer())
      .post('/api/message')
      .send({ message: 'asd', extra: 123 })
      .expect(HttpStatus.CREATED)
      .expect({ message: 'asd' });
  });
});
