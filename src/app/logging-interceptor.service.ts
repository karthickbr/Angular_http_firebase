import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaderResponse, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggingInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('outgoing Request');
    console.log(req.url);
    console.log(req.headers);
    return next.handle(req).pipe(tap(event => {
      console.log(event);
      if (event.type === HttpEventType.Response) {
          console.log('Incoming Response');
          console.log(event.body);
      }
    }));
  }
}
