import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigModule } from './config.module';
import { configComputed, configSchema, Config } from './config';

describe('ConfigService', () => {
  let service: ConfigService<Config>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          schema: configSchema,
          files: './.env.json',
          load: [configComputed],
        }),
      ],
    }).compile();

    service = module.get<ConfigService<Config>>(ConfigService);
  });

  it('ok defined', () => {
    expect(service).toBeDefined();
  });

  it('ok load file', () => {
    expect(typeof service.get('MONGODB_URL')).toBe('string');
  });

  it('ok load computed', () => {
    expect(typeof service.get('MONGODB_NAME')).toBe('string');
  });
});
