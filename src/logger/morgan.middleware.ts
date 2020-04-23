import { Injectable, NestMiddleware } from '@nestjs/common';
import morgan from 'morgan';
import { LoggerService } from './logger.service';
import { Request, Response, NextFunction } from 'express';
import { Config, ConfigService } from '../config';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService<Config>) {}

  logger = new LoggerService('Morgan');

  use(req: Request, res: Response, next: NextFunction) {
    if (this.config.get('NODE_ENV') !== 'development') {
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
