import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { User } from '../../../shared/models/user';

@Component({
  templateUrl: 'feed-loader.component.html',
  selector: 'app-feed-loader',
  styleUrls: ['./feed-loader.component.scss']
})

export class FeedLoaderComponent implements OnInit {
  @Input() loading = false;

  ngOnInit(): void {
  }
}
