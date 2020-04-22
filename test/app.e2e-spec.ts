import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

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

  it('GET /api/hello ok', () => {
    return request(app.getHttpServer())
      .get('/api/hello')
      .expect(200)
      .expect({ message: 'Hello World!' });
  });

  it('GET /api/hello?name=Jakub ok', () => {
    return request(app.getHttpServer())
      .get('/api/hello?name=Jakub')
      .expect(200)
      .expect({ message: 'Hello Jakub!' });
  });

  it('GET /api/hello?name= err empty', () => {
    return request(app.getHttpServer())
      .get('/api/hello?name=')
      .expect(400)
      .then((res) =>
        expect(res.body).toMatchInlineSnapshot(`
          Object {
            "error": "Bad Request",
            "message": Array [
              "name must be longer than or equal to 2 characters",
              "name must contain only letters (a-zA-Z)",
            ],
            "statusCode": 400,
          }
        `),
      );
  });

  it('GET /api/hello?name=a err too short', () => {
    return request(app.getHttpServer())
      .get('/api/hello?name=a')
      .expect(400)
      .then((res) =>
        expect(res.body).toMatchInlineSnapshot(`
          Object {
            "error": "Bad Request",
            "message": Array [
              "name must be longer than or equal to 2 characters",
            ],
            "statusCode": 400,
          }
        `),
      );
  });

  it('GET /api/hello?name=123 err number', () => {
    return request(app.getHttpServer())
      .get('/api/hello?name=123')
      .expect(400)
      .then((res) =>
        expect(res.body).toMatchInlineSnapshot(`
          Object {
            "error": "Bad Request",
            "message": Array [
              "name must contain only letters (a-zA-Z)",
            ],
            "statusCode": 400,
          }
        `),
      );
  });

  it('POST /api/message ok', () => {
    return request(app.getHttpServer())
      .post('/api/message')
      .send({ message: 'abc' })
      .expect(201)
      .expect({ message: 'abc' });
  });

  it('POST /api/message bad request', () => {
    return request(app.getHttpServer())
      .post('/api/message')
      .send({ message: { nested: 'asd' } })
      .expect(400);
  });

  it('POST /api/message extra prop ok', () => {
    return request(app.getHttpServer())
      .post('/api/message')
      .send({ message: 'asd', extra: 123 })
      .expect(201)
      .expect({ message: 'asd' });
  });
});
