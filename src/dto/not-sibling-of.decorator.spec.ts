import { IsString, validateSync, IsBoolean } from 'class-validator';
import { IsNotSiblingOf } from './not-sibling-of.decorator';
import { toClass } from './transform';
import { Expose } from 'class-transformer';

describe('dto IsNotSiblingOf validator', () => {
  class MyDTO {
    @IsString()
    @Expose()
    name!: string;

    @IsBoolean()
    @IsNotSiblingOf(['dumb'])
    @Expose()
    smart!: true;

    @IsBoolean()
    @IsNotSiblingOf(['smart'])
    @Expose()
    dumb!: true;
  }

  it('ok validate incompatibilities', () => {
    const instance = toClass(MyDTO, {
      name: 'NotMe',
      dumb: true,
      smart: true,
    });

    const res = validateSync(instance);

    expect(res.length).toBe(2);

    res.forEach((err) => {
      expect(err.constraints).toHaveProperty('IsNotSiblingOf');
      expect(Object.keys(err.constraints || {}).length).toBe(1);
    });
  });

  it('ok with other validators', () => {
    const instance = toClass(MyDTO, {
      name: 'NotMe',
      dumb: 'true' as any,
      smart: 'true' as any,
    });

    const res = validateSync(instance);

    res.forEach((err) => {
      expect(err.constraints).toHaveProperty('IsNotSiblingOf');
      expect(err.constraints).toHaveProperty('isBoolean');
      expect(Object.keys(err.constraints || {}).length).toBe(2);
    });
  });
});
