import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '../mongo';
import { GlobalModule } from '../global.module';
import { SlugService } from './slug.service';

describe('SlugService', () => {
  let service: SlugService;
  let mod: TestingModule;

  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule],
      providers: [SlugService],
    }).compile();

    service = mod.get(SlugService);
  });

  afterAll(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should match shape', () => {
    const res = service.generate();

    expect(res).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[0-9]{2}$/);
  });

  it('should generate be unique', async () => {
    const res = await service.generateUnique();

    expect(res).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[0-9]{2}$/);
  });
});
