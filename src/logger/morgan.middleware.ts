import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { LoggerService } from './logger.service';
import { ConfigT, InjectConfig } from '../config';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    @InjectConfig() private readonly config: ConfigT,
  ) {}
  use(req: any, res: any, next: any) {
    if (!this.config.DEV) {
      next();
    }

    return morgan('tiny', {
      stream: {
        write: (str) => this.logger.log(str),
      },
    })(req, res, next);
  }
}
