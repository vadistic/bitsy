import { Logger, Injectable, LogLevel, Inject } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

export const LOG_COLLECTION = 'Logs';

type LoggerCache = Record<LogLevel, string[]>;

@Injectable()
export class ContextLogger {
  constructor(
    readonly nest: Logger,
    // https://github.com/nestjs/docs.nestjs.com/issues/937
    @Inject(INQUIRER) readonly context: string,
  ) {}

  log(msg?: string, context?: string) {
    if (msg) {
      this.nest.log(msg, context || this.context);
    }
  }

  error(msg?: string, context?: string) {
    if (msg) {
      this.nest.error(msg, undefined, context || this.context);
    }
  }

  warn(msg?: string, context?: string) {
    if (msg) {
      this.nest.warn(msg, context || this.context);
    }
  }

  debug(msg?: string, context?: string) {
    if (msg) {
      this.nest.debug(msg, context || this.context);
    }
  }

  verbose(msg?: string, context?: string) {
    if (msg) {
      this.nest.verbose(msg, context || this.context);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────────

@Injectable()
export class LoggerService extends ContextLogger {
  readonly cache: LoggerCache = {
    log: [],
    error: [],
    warn: [],
    debug: [],
    verbose: [],
  };

  child(context: string) {
    return new ContextLogger(this.nest, context);
  }

  dump() {
    const cp = { ...this.cache };

    Object.keys(this.cache).forEach((key) => {
      this.cache[key as keyof LoggerCache] = [];
    });

    return cp;
  }
}
