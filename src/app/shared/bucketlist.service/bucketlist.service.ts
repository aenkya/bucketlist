import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Bucketlist } from '../models/bucketlist';

@Injectable()
export class BucketlistService {


  public bucketlistsUrl = 'http://localhost:5000/api/v1/bucketlists';
  private token: string;
  private id: string;
  headers;
  requestoptions;


  constructor ( private http: Http) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.id = currentUser && currentUser.id;

    this.headers = new Headers();

    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('x-access-token', `${this.token}`);
    this.requestoptions = new RequestOptions({
        headers: this.headers
    });
  }

  getBucketlists(): Observable <Bucketlist[]> {
    return this.http
               .get(`${this.bucketlistsUrl}`, this.requestoptions)
               .map((res) => this.extractData(res))
               .catch((err) => this.handleError(err));
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

  private handleError (error: Response | any) {
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
