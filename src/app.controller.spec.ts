import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let app: INestApplication;
  let controller: AppController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<AppController>(AppController);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/healthcheck (GET)', () => {
    it('should return health check status', async () => {
      const response = await request(app.getHttpServer())
        .get('/healthcheck')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        environment: process.env.NODE_ENV,
      });
    });

  });
});