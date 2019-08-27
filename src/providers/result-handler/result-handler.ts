import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logger } from '../logger/logger';
import { mergeMap } from 'rxjs/operators';
import { of } from "rxjs/observable/of";
import { Observable, } from 'rxjs/Observable';

@Injectable()
export class HttpResultInterceptor implements HttpInterceptor {
  constructor(private logger: Logger) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe( mergeMap((event: any) => {
      // 正常返回，处理具体返回参数
      if (event instanceof HttpResponse && event.status === 200) {
          // 具体处理请求返回数据
          return this.handleData(event);
      }
      // 其他情况并不拦截,直接返回
      return of(event);
    }));
  }

  private handleData(event: HttpResponse<any>): Observable<HttpEvent<any>> {
    if (event.body.code === 0) {
      const update = {body: event.body.result};
      // debug: 打印出所有的响应
      this.logger.info("http result: "+ JSON.stringify(update));
      return of(event.clone(update));      
    }
    return of(event);
  }
}
