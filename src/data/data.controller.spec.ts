import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';
import { DataModule } from './data.module';

describe('DataController', () => {
  let controller: DataController;
  let mod: TestingModule;

  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule, DataModule],
    }).compile();

    controller = mod.get<DataController>(DataController);
  });

  afterAll(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
