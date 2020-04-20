import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';

describe('DataService', () => {
  let service: DataService;
  let mod: TestingModule;

  beforeEach(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule],
      providers: [DataService],
    }).compile();

    service = mod.get<DataService>(DataService);
  });

  afterEach(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
