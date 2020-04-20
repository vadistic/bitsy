import { plainToClass } from 'class-transformer';
import { Type, InternalServerErrorException } from '@nestjs/common';

export const serialise = <T>(ref: Type<T>, plain: Partial<T>) =>
  // ! it should use `excludeExtraneousValues: true` but for some reason it skips `value: any` field
  plainToClass(ref, plain);

export type Defined<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export const defined = <T>(obj: T): Defined<T> => {
  Object.entries(obj).forEach(([key, val]) => {
    if (val === undefined) {
      throw new InternalServerErrorException(
        { [key]: undefined },
        `key "${key}" is not defined`,
      );
    }
  });

  return obj as Defined<T>;
};
