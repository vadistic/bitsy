import { InternalServerErrorException } from '@nestjs/common';

// ────────────────────────────────────────────────────────────────────────────────

export type Defined<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export const definedOrReject = <T>(obj: T): Defined<T> => {
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
