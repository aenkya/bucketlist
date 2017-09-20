import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MdDialog} from '@angular/material';
import { Router } from '@angular/router';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';

import { User } from '../shared/models/user';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-bucketlists',
  templateUrl: './bucketlist.component.html',
  styleUrls: ['./bucketlist.component.scss'],
  providers: [BucketlistService, UserService]
})
export class BucketlistComponent implements OnInit {

  allBucketlists: Bucketlist;
  public authUser: User[];
  model: any = {};
  public result: any;
  loading = false;
  someBuckets = false; // check if there are some bucketlists
  errorMessage: any;
  id;

  constructor(
    private bucketlistService: BucketlistService,
    private userService: UserService,
    public dialog: MdDialog,
    private router: Router
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = currentUser && currentUser.id;
  }

  ngOnInit(): void {
    this.authUser = this.userService.authUser;
    this.getBucketlists();
  }

  getBucketlists(): void {
    this.loading = !this.loading;
    this.bucketlistService.getBucketlists().subscribe(
      res => {
        this.loading = !this.loading;
        this.allBucketlists = res['data'];
      },
      error => {
        this.errorMessage = error;
      });
  }

  checkItem(item: any) {
    return (item === undefined || item.length === 0) ? false : true;
  }

}
