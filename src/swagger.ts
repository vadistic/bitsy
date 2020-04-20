import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFile, readJSON } from 'fs-extra';
import { join } from 'path';

export const useSwagger = async (route: string, app: INestApplication) => {
  const pkg = await readJSON(join(__dirname, '../package.json'));

  const description = await readFile(join(__dirname, '../README.md'), 'utf-8')
    // remove first line with title
    .then((file) => file.substring(file.indexOf('\n') + 1));

  const options = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(description)
    .setVersion(pkg.version)
    .addTag('data')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/', app, document);
};
