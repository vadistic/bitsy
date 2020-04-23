import { Transform } from 'class-transformer';

export const TransformDictionary = (config: Record<string | number, any>) =>
  Transform((value: any) => {
    if (typeof value === 'string' || typeof value === 'number') {
      if (config[value]) {
        return config[value];
      }
    }

    return value;
  });
