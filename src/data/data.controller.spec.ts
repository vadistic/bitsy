import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';

describe('DataController', () => {
  let controller: DataController;
  let mod: TestingModule;

  beforeEach(async () => {
    mod = await Test.createTestingModule({
      imports: [MongoModule, GlobalModule],
      controllers: [DataController],
      providers: [DataService],
    }).compile();

    controller = mod.get<DataController>(DataController);
  });

  afterEach(async () => {
    await mod.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
