import 'reflect-metadata';

import { PaginationDTO } from './common.dto';
import { toClass } from './transform';

describe('dto serialisation', () => {
  it('doesnt overwrite provided values', () => {
    const dto = toClass(PaginationDTO, { limit: 99 });
    expect(dto.limit).toBe(99);
  });

  it('coerces string to int', () => {
    const dto = toClass(PaginationDTO, { limit: '10' } as any);
    expect(typeof dto.limit).toBe('number');
  });

  it('adds defualt values ', () => {
    const dto = toClass(PaginationDTO, {});

    expect(dto.limit).toBe(10);
    expect(dto.sort).toBe(-1);
  });

  it('excludes extra properties', () => {
    const dto = toClass(PaginationDTO, { extra: 'asd' } as any);

    expect(dto).not.toHaveProperty('extra');
  });

  it('applies transforms to alias', () => {
    const dto = toClass(PaginationDTO, { sort: 'asc' } as any);

    expect(dto.sort).toBe(1);
  });

  it('applies transforms to number strings', () => {
    const dto = toClass(PaginationDTO, { sort: '-1' } as any);

    expect(dto.sort).toBe(-1);
  });
});
