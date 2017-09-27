import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MdDialog} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';
import {DialogsService} from '../shared/core/dialogs.service';

import { User } from '../shared/models/user';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-bucketlist-detail',
  templateUrl: './bucketlist-detail.component.html',
  styleUrls: ['./bucketlist-detail.component.scss'],
  providers: [BucketlistService, UserService]
})
export class BucketlistDetailComponent implements OnInit {
  bucketlist: Bucketlist;
  public authUser: User[];
  model: any = {};
  public result: any;
  loading = false;
  feedLoading = false;
  noItems = false;
  errorMessage: any;
  id;
  bucketlist_id: number;

  constructor(
    private bucketlistService: BucketlistService,
    private userService: UserService,
    public dialog: MdDialog,
    private router: Router,
    private dialogService: DialogsService,
    private _route: ActivatedRoute
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = currentUser && currentUser.id;
  }

  ngOnInit(): void {
    this.authUser = this.userService.authUser;
    this.getBucketlist();
  }

  getBucketlist(): void {
    this.feedLoading = !this.feedLoading;
    this.bucketlist_id = +this._route.snapshot.params['id'];
    this.bucketlistService.getBucketlist(this.bucketlist_id).subscribe(
      res => {
        this.feedLoading = !this.feedLoading;
        this.bucketlist = res;
      },
      error => {
        this.feedLoading = !this.feedLoading;
        this.noItems = true;
        this.errorMessage = error;
      });
  }

  addItem() {
    this.loading = !this.loading;
    this.model.bucketlist_id = this.bucketlist_id;
    this.bucketlistService.addItem(this.model).subscribe(
      res => {
        if (res === true) {
          this.loading = !this.loading;
          this.getBucketlist();
        }
      },
      error => {
        this.loading = !this.loading;
        this.errorMessage = error;
      }
    );
  }

  openDialog(componentName, item) {
    switch (componentName) {
      case 'delete':
        this.dialogService
            .confirm('Confirm Dialog', 'Are you sure you want to delete the item?')
            .subscribe(res => {
              res === true ? this.delete(item) : res = this.result;
            });
        break;

      default:
        break;
    }
  }

  delete(bucketlist: number) {

  }

  checkItem(item: any) {
    return (item === undefined || item.length === 0) ? false : true;
  }

}
