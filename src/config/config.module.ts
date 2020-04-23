import { DynamicModule } from '@nestjs/common';
import { Config } from './config';
import { ConfigService } from './config.service';
import { Schema } from 'convict';

export interface ConfigModuleOptions {
  schema: Schema<any>;
  files?: string | string[];
  isGlobal?: boolean;
  load?: (Partial<Config> | ((config: Config) => Partial<Config>))[];
}

export class ConfigModule {
  static forRoot({
    schema,
    files,
    load,
    isGlobal = true,
  }: ConfigModuleOptions): DynamicModule {
    const service = new ConfigService(schema);

    if (files) service.loadFile(files);
    if (load) service.load(load);

    service.convict.validate();

    return {
      module: ConfigModule,
      providers: [{ provide: ConfigService, useValue: service }],
      exports: [ConfigService],
      global: isGlobal,
    };
  }
}
