import { plainToClass, ClassTransformOptions } from 'class-transformer';
import { Type, ValidationPipe } from '@nestjs/common';
import { Groups } from './common.dto';

export const transformOptions: ClassTransformOptions = {
  // makes nacesary to use Expose(), but it's the only way to saveguard extra props
  excludeExtraneousValues: true,
  // would be nice, but it is applied before transforms, need to use Type() instead
  // enableImplicitConversion: true,
};

export function toClass<T, V extends Partial<T> = Partial<T>>(
  ref: Type<T>,
  plain: V[],
): T[];
export function toClass<T, V extends Partial<T> = Partial<T>>(
  ref: Type<T>,
  plain: V,
): T;
export function toClass<T, V extends Partial<T> = Partial<T>>(
  ref: Type<T>,
  plain?: V,
): T | undefined;
export function toClass<T, V extends Partial<T>>(
  ref: Type<T>,
  plain: V | null,
): T | null;
export function toClass<T, V extends Partial<T>>(
  ref: Type<T>,
  plain?: V | V[],
) {
  if (!plain) {
    return plain;
  }

  return plainToClass(ref, plain, {
    // ...transformOptions,
    groups: [Groups.DEFAULT],
  });
}

export function toMongo<T, V extends Partial<T> = Partial<T>>(
  ref: Type<T>,
  plain: V[],
): T[];
export function toMongo<T, V extends Partial<T> = Partial<T>>(
  ref: Type<T>,
  plain: V,
): T;
export function toMongo<T, V extends Partial<T> = Partial<T>>(
  ref: Type<T>,
  plain: V | V[],
) {
  return plainToClass(ref, plain, {
    // ...transformOptions,
    groups: [Groups.MONGO],
  });
}

// how to DI this?
export const CustomValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions,
});
