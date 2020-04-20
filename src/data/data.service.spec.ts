import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { MongoModule } from '../mongo/mongo.module';
import { GlobalModule } from '../global.module';
import { ItemDTO } from './data.dto';

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

  describe('private', () => {
    it('should generate funny identifier', () => {
      const res = service.getFunnyIdentifier();

      expect(res).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[0-9]{2}$/);
    });

    it('should generate unique identifier', async () => {
      const res = await service.getUniqueIdentifier();

      expect(res).toMatch(/^[a-z]+-[a-z]+-[a-z]+-[0-9]{2}$/);
    });
  });

  describe('create', () => {
    it('should push to existing bucket', async () => {
      const value = { message: 'Push to existing', when: new Date() };
      const identifier = 'data-service-test-01';

      const item = ItemDTO.create({ identifier, value });

      const pushed = await service.pushToBucket({
        identifier,
        value,
      });

      const last = await service.findLastItem({ identifier });

      // has exactly the same keys
      expect(Object.keys(pushed)).toEqual(Object.keys(item));

      expect(pushed).toMatchObject({ value });

      expect(pushed).toEqual(last);
    });

    it('should push to new bucket', async () => {
      const value = { message: 'Push to new', when: new Date() };

      const pushed = await service.pushToBucket({
        value,
      });

      const item = ItemDTO.create({ identifier: pushed.identifier, value });

      const last = await service.findLastItem({
        identifier: pushed.identifier,
      });

      expect(pushed).toMatchObject({ value });

      // has exactly the same keys
      expect(Object.keys(pushed)).toEqual(Object.keys(item));

      expect(pushed).toMatchObject({ value });

      expect(pushed).toEqual(last);
    });
  });

  describe('aggregate', () => {
    it('should aggregate bucket', async () => {
      const identifier = 'data-service-test-01';

      const all = await service.findManyItems({ identifier });
      const bucket = await service.findOneBucket({ identifier });

      // length
      expect(all.length).toBe(bucket?.count);
      expect(all.length).toBe(bucket?.items.length);

      // it's shallow
      expect(bucket?.items[0]).not.toHaveProperty('value');
    });
  });
});
