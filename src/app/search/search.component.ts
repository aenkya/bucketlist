import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  bucketlists: Observable<Boolean>;
  private searchTerms = new Subject<string>();

  constructor(private bucketlistService: BucketlistService, private router: Router) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.bucketlists = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term
        ? this.bucketlistService.search(term)
        : Observable.of(true)
      )
      .catch(error => {
        console.log(error);
        return Observable.of<Boolean>(true);
      });
  }

  enterSearch(term) {
    this.bucketlistService.search(term);
  }
}
