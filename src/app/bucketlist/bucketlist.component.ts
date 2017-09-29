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
  providers: [UserService]
})
export class BucketlistComponent implements OnInit {

  allBucketlists: any;
  page_meta: any;
  public authUser: User[];
  model: any = {};
  public result: any;
  feedLoading = false;
  loading = false;
  noBucketlists = false; // check if there are some bucketlists
  errorMessage: any;
  id;
  edit = false;
  editBucketlist: number;
  firstPage = true;

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

    this.bucketlistService.primaryStream.subscribe((event) => {
      if (event) {
        this.getBucketlists();
      }
    });
  }

  getBucketlists(from_delete = false): void {
    this.feedLoading = !this.feedLoading;
    if (from_delete) {
      this.allBucketlists = {};
    }
    this.bucketlistService.getBucketlists().subscribe(
      res => {
        this.feedLoading = !this.feedLoading;
        this.allBucketlists = res;
        if (this.allBucketlists.data) {
          this.noBucketlists = false;
        }
        if (this.allBucketlists.page !== 1) {
          this.firstPage = false;
        }
      },
      error => {
        this.feedLoading = !this.feedLoading;
        this.noBucketlists = true;
        this.errorMessage = error;
      });
  }

  getPage(nextPage: string) {
    this.bucketlistService.getPage(nextPage).subscribe(res => {
      this.allBucketlists = res;
      if (this.allBucketlists.data) {
        this.noBucketlists = false;
      }
    },
    error => {
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
          this.getBucketlists(true);
        }
      },
      error => {
        this.errorMessage = error;
        this.openSnackBar(this.errorMessage, 'RETRY');
      });
  }

  updateBucketlist(bucketlist: number) {
    this.loading = !this.loading;
    this.model.id = bucketlist;
    return this.bucketlistService.updateBucketlist(this.model).subscribe(
      res => {
        this.resetValues();
        if (res) {
          this.loading = !this.loading;
          this.getBucketlists();
          this.toggleEdit();
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

  toggleEdit(bucketlist = null) {
    this.resetValues();
    this.editBucketlist = bucketlist;
    this.edit = !this.edit;
  }

  resetValues(): void {
    this.model.name = null;
  }

}
