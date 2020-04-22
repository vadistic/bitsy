import { Transform } from 'class-transformer';

// using decorator beacuse simple assigment does not play well with class transformation
// TODO: this should add swagger annotation
export const Default = (defaultValue: (() => any) | any) =>
  Transform((value) => {
    if (value !== undefined) return value;

    if (typeof defaultValue === 'function') return defaultValue();

    return defaultValue;
  });
