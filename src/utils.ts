export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const res: T = { ...obj };

  for (const key of keys) {
    delete res[key as keyof T];
  }

  return res;
};
