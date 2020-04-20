import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
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
});
