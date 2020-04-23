import { Transform } from 'class-transformer';

// https://github.com/typestack/class-transformer/issues/129
export const Default = (defaultValue: any) => {
  return Transform((value: any, obj: any) => {
    if (value !== null && value !== undefined) return value;
    if (typeof defaultValue === 'function') return defaultValue(obj);
    if (Array.isArray(defaultValue)) return [...defaultValue];
    if (typeof defaultValue === 'object') {
      return defaultValue === null ? null : { ...defaultValue };
    }
    return defaultValue;
  });
};
