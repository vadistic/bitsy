import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import morgan from 'morgan';
import { LoggerService } from './logger.service';
import { ConfigT, InjectConfig } from '../config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(
    @InjectConfig() private readonly config: ConfigT,
    private readonly nestLogger: Logger,
  ) {}

  logger = new LoggerService(this.nestLogger, 'Morgan');

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.config.DEV) {
      next();
      return;
    }

    return morgan('short', {
      stream: {
        write: (str) => this.logger.verbose(str),
      },
    })(req, res, next);
  }
}
