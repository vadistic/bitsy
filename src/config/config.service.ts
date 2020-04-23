import { Injectable } from '@nestjs/common';
import convict, { Schema } from 'convict';

@Injectable()
export class ConfigService<T> {
  constructor(readonly schema: Schema<T>) {}

  readonly convict = convict(this.schema);

  loadFile(files: string | string[]) {
    this.convict.loadFile(files);
  }

  load(partials: (Partial<T> | ((config: T) => Partial<T>))[]) {
    let next = this.convict.getProperties();

    partials.forEach((partial) => {
      if (typeof partial === 'function') {
        next = { ...next, ...partial(this.convict.getProperties()) };
      } else {
        next = { ...next, ...partial };
      }
    });

    this.convict.load(next);
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.convict.get(key) as any;
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    return this.convict.set(key, value as any);
  }
}
