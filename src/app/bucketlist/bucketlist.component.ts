import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import { Router } from '@angular/router';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';
import {DialogsService} from '../shared/core/dialogs.service';

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
  noBucketlists = false; // check if there are some bucketlists
  errorMessage: any;
  id;

  constructor(
    private bucketlistService: BucketlistService,
    private userService: UserService,
    public snackBar: MdSnackBar,
    private dialogService: DialogsService,
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
        this.loading = !this.loading;
        this.noBucketlists = true;
        this.errorMessage = error;
      });
  }

  openDialog(componentName, bucketlist = null) {
    switch (componentName) {
      case 'delete':
        if (!bucketlist) {
          return false;
        }
        this.dialogService
            .confirm('Confirm Dialog', 'Are you sure you want to delete the bucketlist?')
            .subscribe(res => {
              res === true ? this.delete(bucketlist) : res = this.result;
            });
        break;

      default:
        break;
    }
  }

  delete(bucketlist: number) {
    this.loading = !this.loading;
    this.bucketlistService.deleteBucketlist(bucketlist).subscribe(
      res => {
        if (res) {
          this.openSnackBar('Bucketlist Deleted', 'UNDO');
        }
      },
      error => {
        this.errorMessage = error;
        this.openSnackBar(this.errorMessage, 'RETRY');
      });
  }

  openSnackBar(message: string, action: string) {
    this.loading = !this.loading;
    this.snackBar.open(message, 'UNDO', {
      duration: 2000,
    });
  }

  checkItem(item: any) {
    return (item === undefined || item.length === 0) ? false : true;
  }

}
