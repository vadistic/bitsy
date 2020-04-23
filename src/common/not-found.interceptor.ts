import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((val) => {
        if (val === null) {
          throw new NotFoundException();
        } else {
          return val;
        }
      }),
    );
  }
}
