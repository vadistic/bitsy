import { Schema } from 'convict';

export const configSchema = {
  NODE_ENV: {
    default: 'development',
    format: ['production', 'development', 'test'],
    env: 'NODE_ENV',
  },

  MONGODB_URL: {
    default: (undefined as unknown) as string,
    format: String,
    env: 'MONGODB_URL',
  },

  MONGODB_USER: {
    default: (undefined as unknown) as string,
    format: String,
    env: 'MONGODB_USER',
  },

  MONGODB_PASS: {
    default: (undefined as unknown) as string,
    format: String,
    env: 'MONGODB_PASS',
  },

  MONGODB_NAME: {
    default: (undefined as unknown) as string,
    format: String,
    env: 'MONGODB_NAME',
  },

  MONGODB_PORT: {
    default: (undefined as unknown) as number,
    format: 'port',
    env: 'MONGODB_PORT',
  },

  MONGODB_HOST: {
    default: (undefined as unknown) as string,
    format: String,
    env: 'MONGODB_HOST',
  },
};

export type Config = typeof configSchema extends Schema<infer T> ? T : never;

// ────────────────────────────────────────────────────────────────────────────────

const mongoUrlRegExp = /mongodb:\/\/(?<MONGODB_USER>[\w-.]+):(?<MONGODB_PASS>[\w-.]+)@(?<MONGODB_HOST>[\w-.]+)(?:\:(?<MONGODB_PORT>[0-9.]+))*\/*(?<MONGODB_NAME>[\w-.]+)/;

export const configComputed = (config: Config): Partial<Config> => {
  const match = mongoUrlRegExp.exec(config.MONGODB_URL);

  if (!config.MONGODB_URL || !match || !match.groups) return {};

  const {
    MONGODB_USER,
    MONGODB_PASS,
    MONGODB_NAME,
    MONGODB_PORT,
    MONGODB_HOST,
  } = match.groups;

  return {
    MONGODB_PORT: +MONGODB_PORT,
    MONGODB_USER,
    MONGODB_PASS,
    MONGODB_NAME,
    MONGODB_HOST,
  };
};
