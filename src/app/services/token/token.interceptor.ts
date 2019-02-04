import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import { HandlerErrorHelpers } from '../../helpers/handle-error.helpers';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  protected handlerErrorHelper;

  constructor(
    public authService: AuthService,
    private handler: HandlerErrorHelpers) {
    this.handlerErrorHelper = handler;
  }



  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();

    request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next.handle(request).pipe(tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {

            if (event.body.error) {
              this.handlerErrorHelper.handle(event);
              throw(event);

            }
          }
        },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            this.handlerErrorHelper.handle(error);

          }
        }
      )
    );
  }
}
