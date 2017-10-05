import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../shared/models/user';

@Component({
  templateUrl: 'nobuckets.component.html',
  selector: 'app-nobuckets',
  styleUrls: ['./nobuckets.component.scss']
})

export class NoBucketsComponent implements OnInit {
  @Input() nobucketlists: boolean;
  @Input() isBucketlist: boolean;
  @Input() isItem: boolean;
  @Input() isSearchData: boolean;

  constructor(private router: Router) {
    this.nobucketlists = true;
  }

  ngOnInit(): void {

  }
}
