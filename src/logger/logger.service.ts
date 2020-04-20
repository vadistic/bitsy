import { Logger, Injectable } from '@nestjs/common';

export const LOG_COLLECTION = 'Logs';

interface LoggerCache {
  log: string[];
  error: string[];
  warn: string[];
  debug: string[];
  verbose: string[];
}

@Injectable()
export class LoggerService {
  private readonly nest = new Logger('app', true);

  readonly cache: LoggerCache = {
    log: [],
    error: [],
    warn: [],
    debug: [],
    verbose: [],
  };

  log(message: string) {
    this.nest.log(message);
  }

  error(message: string, trace: string) {
    this.nest.error(message, trace);
  }

  warn(message: string) {
    this.nest.warn(message);
  }

  debug(message: string) {
    this.nest.debug(message);
  }

  verbose(message: string) {
    this.nest.verbose(message);
  }

  dump() {
    const cp = { ...this.cache };

    Object.keys(this.cache).forEach((key) => {
      this.cache[key as keyof LoggerCache] = [];
    });

    return cp;
  }
}
