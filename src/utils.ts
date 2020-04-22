import { plainToClass } from 'class-transformer';
import { Type, InternalServerErrorException } from '@nestjs/common';

export interface SerialiseOptions<T> {
  whitelist?: (keyof T)[];
  blacklist?: (keyof T)[];
}
// cannot get class transformer to work correctly with whitelisting....
export const serialise = <T>(
  ref: Type<T>,
  {
    whitelist = (ref as any).whitelist,
    blacklist = (ref as any).blacklist,
  }: SerialiseOptions<T> = {},
) => (plain: Partial<T>) => {
  if (!whitelist && !blacklist) {
    return plainToClass(ref, plain);
  }

  const res = {} as T;

  for (const key of Object.keys(plain)) {
    const _key = key as keyof T;
    const _val = plain[_key] as T[keyof T] | undefined;

    if (!_val) {
      continue;
    }

    if (whitelist) {
      if (whitelist.includes(_key)) res[_key] = _val;
    }

    if (blacklist) {
      if (!blacklist.includes(_key)) res[_key] = _val;
    }
  }

  return plainToClass(ref, res);
};

type PartialOmit<T, K extends string> = {
  [Key in Exclude<keyof T, K>]: T[Key];
} &
  {
    [Key in Extract<keyof T, K>]?: T[Key];
  };

export const Serialisable = <T, K extends string = never>() => {
  return class Serialisable {
    static create(input: PartialOmit<T, K>): T;
    static create(input?: PartialOmit<T, K> | null): T | undefined;
    static create(input?: PartialOmit<T, K>): T | undefined {
      if (input) {
        return serialise<T>(this as any)(input as any);
      }
    }

    static async createAsync(input: Promise<PartialOmit<T, K>>): Promise<T>;
    static async createAsync(
      input?: Promise<PartialOmit<T, K> | null>,
    ): Promise<T | undefined>;
    static async createAsync(
      input?: Promise<PartialOmit<T, K>>,
    ): Promise<T | undefined> {
      const res = await input;
      if (res) {
        return serialise<T>(this as any)(res as any);
      }
    }

    static whitelist?: (keyof T)[];

    static blacklist?: (keyof T)[];
  };
};

// ────────────────────────────────────────────────────────────────────────────────

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
