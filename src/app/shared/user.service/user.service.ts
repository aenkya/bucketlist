import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

import { User } from '../models/user';

@Injectable()
export class UserService {

    private getUserUrl = 'http://localhost:5000/api/v1/users';
    public authUser: User[];
    public available_users;
    public token: string;
    headers;
    requestoptions;
    public availability;

    constructor(private http: Http) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.token = currentUser && currentUser.token;

      this.headers = new Headers();

      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
      this.headers.append('x-access-token', `${this.token}`);
      this.headers.append('use_token', true);
      this.requestoptions = new RequestOptions({
          headers: this.headers
      });
    }

    getUser(user_id: string): Observable <Boolean> {
      return this.http
           .get(this.getUserUrl, this.requestoptions)
           .map((res: Response) => {
              this.authUser = res.json();
              return true; })
           .catch((err) => this.handleError(err));
    }

    public extractData(res: Response) {
        const body = res.json();
        return body;
    }

    public handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
