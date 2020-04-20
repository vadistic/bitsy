/* eslint-disable @typescript-eslint/no-use-before-define */
import { ConfigType, registerAs } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { defined } from './utils';

const mongoRx = /mongodb:\/\/(?<user>[\w-.]+):(?<pass>[\w-.]+)@(?<host>[\w-.]+)(?<port>:[0-9.]+)*\/*(?<name>[\w-.]+)/;

export const configuration = registerAs('config', () => {
  const { groups = {} } = mongoRx.exec(process.env.MONGODB_URL || '') || {};

  const config = defined({
    DEV: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',

    MONGODB_URL: process.env.MONGODB_URL,
    MONGODB_USER: process.env.MONGODB_USER || groups.user,
    MONGODB_PASS: process.env.MONGODB_PASS || groups.pass,
    MONGODB_NAME: process.env.MONGODB_NAME || groups.name,
  });

  return config;
});

// ────────────────────────────────────────────────────────────────────────────────

export const InjectConfig = () => Inject(configuration.KEY);

export type ConfigT = ConfigType<typeof configuration>;
