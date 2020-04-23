import { Logger, Injectable, Inject } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable()
export class LoggerService {
  constructor(
    // https://github.com/nestjs/docs.nestjs.com/issues/937
    @Inject(INQUIRER) readonly context: string = 'AppModule',
    readonly nest: Logger = new Logger(),
  ) {}

  log(msg?: any, subcontext?: string) {
    if (msg) {
      this.nest.log(msg, this.join(subcontext));
    }
  }

  error(msg?: any, subcontext?: string) {
    if (msg) {
      this.nest.error(msg, undefined, this.join(subcontext));
    }
  }

  warn(msg?: any, subcontext?: string) {
    if (msg) {
      this.nest.warn(msg, this.join(subcontext));
    }
  }

  debug(msg?: any, subcontext?: string) {
    if (msg) {
      this.nest.debug(msg, this.join(subcontext));
    }
  }

  verbose(msg?: any, subcontext?: string) {
    if (msg) {
      this.nest.verbose(msg, this.join(subcontext));
    }
  }

  child(subcontext: string) {
    return new LoggerService(
      this.context.split('/').concat(subcontext).slice(-1).join('/'),
      this.nest,
    );
  }

  protected join(subcontext?: string) {
    return [this.context, subcontext].filter(Boolean).join('/');
  }
}
