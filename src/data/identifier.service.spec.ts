import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';
import { IdentifierService } from './identifier.service';
import { DataModule } from './data.module';

describe('IdentifierService', () => {
  let service: IdentifierService;
  let mod: TestingModule;

  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule, DataModule],
    }).compile();

    service = mod.get(IdentifierService);
  });

  afterAll(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('naming', () => {
    it('should generate funny identifier', () => {
      const res = service.generate();

      expect(res).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[0-9]{2}$/);
    });

    it('should generate unique identifier', async () => {
      const res = await service.generateUnique();

      expect(res).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[0-9]{2}$/);
    });
  });
});
