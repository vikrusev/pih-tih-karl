import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { filter, tap, catchError } from 'rxjs/operators';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newUrl = environment.apiUrl + req.urlWithParams;
        let path = window.location.pathname;

        const newReq = req.clone({ url: newUrl, withCredentials: true, setHeaders:{path: path} });
        return next.handle(newReq).pipe(
            filter(event => event instanceof HttpResponse),
            tap((event: HttpResponse<any>) => {
                console.log(event)
                const status = event.status;

                // TO-DO: pass the error to the catchError()
                if (status === 401 || status === 403 || status === 404) {
                    return throwError(new HttpErrorResponse(event));
                }
                else {
                    console.log('Response is valid.');
                }
            }),
            catchError((err: HttpErrorResponse) => {
                console.error(`HttpResponse error occured. ERROR: ${err.message}`);
                return throwError(err);
            })
        );
    }
}
