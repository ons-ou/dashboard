import {
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cached = cache.get(req.urlWithParams);
  const isCacheHit = cached !== undefined;
  if (isCacheHit) {
    return of(cached);
  }

  return next(req).pipe(
    tap((response) => cache.set(req.urlWithParams, response)),
    catchError((response) => {
      cache.delete(req.urlWithParams);
      return throwError(()=>response) // Emit null and complete immediately
    })
  );
  

};
