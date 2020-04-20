export interface Dictionary<T> {
  [index: string]: T;
}

export type StrictProjection<T> = {
  [K in keyof T]: 0 | 1;
};
