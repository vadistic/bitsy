import { plainToClass, ClassTransformOptions } from 'class-transformer';
import { Type, ValidationPipe } from '@nestjs/common';

export const transformOptions: ClassTransformOptions = {
  // this makes nacesary to use Expose() but it's only way to saveguard extra props
  excludeExtraneousValues: true,
  // this would be nice, but it is applied before transforms. need to use Type()
  // enableImplicitConversion: true,
};

export function toClass<T, V extends Partial<T>>(ref: Type<T>, plain: V[]): T[];
export function toClass<T, V extends Partial<T>>(ref: Type<T>, plain: V): T;
export function toClass<T, V extends Partial<T>>(ref: Type<T>, plain: V | V[]) {
  return plainToClass(ref, plain, transformOptions);
}

// how to DI this?
export const CustomValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions,
});
