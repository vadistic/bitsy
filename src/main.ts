import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { config } from 'dotenv';
config();

import { AppModule } from './app.module';

const readFileP = promisify(readFile);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const descriptionMd = await readFileP(
    join(__dirname, '../README.md'),
    'utf-8',
  );

  // remove double title
  const decription = descriptionMd.substring(descriptionMd.indexOf('\n') + 1);

  const options = new DocumentBuilder()
    .setTitle('Auto Form Server')
    .setDescription(decription)
    .setVersion('1.0')
    .addTag('cool', 'api')
    .setLicense('MIT', `https://en.wikipedia.org/wiki/MIT_License`)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
