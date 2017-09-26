import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import { User } from '../../../shared/models/user';

@Component({
  templateUrl: 'loader.component.html',
  selector: 'app-loader',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {
  @Input() loading = false;

  ngOnInit(): void {
  }
}
