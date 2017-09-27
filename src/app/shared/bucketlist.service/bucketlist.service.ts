import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Bucketlist } from '../models/bucketlist';
import { AuthService } from '../auth.service';

@Injectable()
export class BucketlistService {


  private bucketlistsUrl = 'http://localhost:5000/api/v1/bucketlists';
  private token: string;
  private id: string;
  headers;
  requestoptions;


  constructor ( private http: Http, private authService: AuthService) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;

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

  getBucketlist(id: number): Observable <Bucketlist> {
    return this.http
               .get(`${this.bucketlistsUrl}/${id}`, this.requestoptions)
               .map((res) => this.extractData(res))
               .catch((err) => this.handleError(err));
  }

  createBucketlist(bucketlist): Observable <Boolean> {
    return this.http
                   .post(this.bucketlistsUrl, JSON.stringify(bucketlist), this.requestoptions)
                   .map((res: Response) => {
                      this.getBucketlists();
                      return true;
                   })
                   .catch((err) => this.handleError(err));
  }

  updateBucketlist(model) {
    return this.http
                   .put(`${this.bucketlistsUrl}/${model.bucketlist_id}`, JSON.stringify(model), this.requestoptions)
                   .map((res: Response) => {
                      return true;
                   })
                   .catch((err) => this.handleError(err));
  }

  addItem(item) {
    return this.http
    .post(`${this.bucketlistsUrl}/${item.bucketlist_id}/items`,
      JSON.stringify(item),
      this.requestoptions)
    .map((res: Response) => {
       return true;
    })
    .catch((err) => this.handleError(err));
  }

  deleteBucketlist(bucketlist) {
    console.log(bucketlist)
    return this.http
    .delete(`${this.bucketlistsUrl}/${bucketlist}`, this.requestoptions)
    .map((res: Response) => {
       return true;
    })
    .catch((err) => this.handleError(err));
  }

  private extractData(res: Response) {
    const body = res.json();
    return body;
  }

  private handleError (error: Response | any ) {
    if (error.status === 401) {
      this.authService.login('test', 'test')
      .subscribe(result => {
        if (result === true) {
          return;
        }
    });
    }
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}
