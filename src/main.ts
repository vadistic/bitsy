import { NestFactory } from '@nestjs/core';
import { json } from 'body-parser';

import { AppModule } from './app.module';
import { useSwagger } from './swagger';

async function bootstrap() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  const isDev = process.env.NODE_ENV === 'development';

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: isDev
      ? ['error', 'warn', 'log', 'verbose', 'debug']
      : ['error', 'warn'],
  });

  app.use(json({ limit: '5mb' }));

  await useSwagger('/', app);
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
