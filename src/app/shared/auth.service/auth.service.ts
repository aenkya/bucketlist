import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../models/user';

@Injectable()
export class AuthService {
    private authUrl = 'http://localhost:5000/api/v1/auth/login';
    private registerUrl = 'http://127.0.0.1:5000/api/v1/auth/register';
    public token: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    register(model): Observable <Boolean>  {

        const headers = new Headers();
        const data = {
            'first_name': `${model.first_name}`,
            'last_name': `${model.last_name}`,
            'email': `${model.email}`,
            'password': `${model.password}`,
            'password_confirm': `${model.password_confirm}`,
        };
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        const requestoptions = new RequestOptions({
            headers: headers
        });
        return this.http
        .post(this.registerUrl, JSON.stringify(data), requestoptions)
        .map((res: Response) => {
            if (res.status === 201) {
                return true;
            }
        })
        .catch((err) => this.handleError(err));
}

    login(email: string, password: string): Observable <Boolean> {
      const headers = new Headers();
      const data = {
          'email': `${email}`,
          'password': `${password}`
      };
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      const requestoptions = new RequestOptions({
          headers: headers
      });

      return this.http
                 .post(this.authUrl, JSON.stringify(data), requestoptions)
                 .map((res: Response) => {
                     // login successful if there's a jwt token in the response message
                     const token = res.json() && res.json().token;
                     const id = res.json() && res.json().id;
                     if (token) {
                         // set token property
                         this.token = token;
                         // store id and jwt token in local storage to keep user logged in between page refreshes
                         localStorage.setItem(
                             'currentUser',
                             JSON.stringify({
                                 id: id,
                                 token: token
                                })
                            );
                         // return true to indicate successful login
                         return true;
                     } else {
                         // return false to indicate failed login
                         return false;
                     }
                 })
                 .catch((err) => this.handleError(err));
    }

    public handleError (error: Response | any) {
        let err;
        if (error instanceof Response) {
            err = error.json().message;
        } else {
            err = error.message ? error.message : error.toString();
        }
        return Observable.throw(err);
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
