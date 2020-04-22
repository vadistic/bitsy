import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';
import { GlobalService } from './global.service';
import { DataModule } from './data.module';

describe('GlobalService', () => {
  let service: GlobalService;
  let mod: TestingModule;

  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule, DataModule],
    }).compile();

    service = mod.get(GlobalService);
  });

  afterAll(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
