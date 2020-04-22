import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { LoggerService } from './logger.service';
import { ConfigT, InjectConfig } from '../config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    @InjectConfig() private readonly config: ConfigT,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    if (!this.config.DEV) {
      next();
      return;
    }

    return morgan('short', {
      stream: {
        write: (str) => this.logger.verbose(str, 'Morgan'),
      },
    })(req, res, next);
  }
}
