import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import { Router } from '@angular/router';

import { Bucketlist } from '../shared/models/bucketlist';
import { Item } from '../shared/models/item';
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
  noSearchData = false;
  errorMessage: any;
  id;
  edit = false;
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
      if (event === true) {
        this.getBucketlists();
      } else if (event.trim()) {
        this.getBucketlists(event);
      } else {
        this.getBucketlists();
      }
    });
  }

  getBucketlists(search_value: string = null, from_delete = false): void {
    this.feedLoading = !this.feedLoading;
    if (from_delete) {
      this.allBucketlists = {};
    }
    this.bucketlistService.getBucketlists(search_value).subscribe(
      res => {
        this.feedLoading = !this.feedLoading;
        this.allBucketlists = res;
        if (this.allBucketlists.data.length > 0) {
          this.noBucketlists = false;
          this.computeProgress(this.allBucketlists.data);
        } else {
          if (search_value) {
            this.noSearchData = true;
          } else {
            this.noBucketlists = true;
          }
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
        this.computeProgress(this.allBucketlists.data);
      }
    },
    error => {
      this.errorMessage = error;
    });
  }

  computeProgress(bucketlists: Bucketlist[]) {
    for (let i = 0; i < bucketlists.length; i++) {
      let totalCounter = 0;
      let completeCounter = 0;
      if (bucketlists[i].items.length < 1) {
        this.allBucketlists.data[i].total = totalCounter;
        continue;
      }
      for (let j = 0; j < bucketlists[i].items.length; j++) {
        if (bucketlists[i].items[j].active) {
          totalCounter++;
        }
        if (bucketlists[i].items[j].done && bucketlists[i].items[j].active) {
          completeCounter++;
        }
      }
      this.allBucketlists.data[i].progress = (completeCounter / totalCounter) * 100;
      this.allBucketlists.data[i].total = totalCounter;
    }
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
          this.getBucketlists(null, true);
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
    this.model.id = bucketlist.id;
    this.model.name = bucketlist.name;
    this.model.description = bucketlist.description;
    this.edit = !this.edit;
  }

  resetValues(): void {
    this.model.name = null;
    this.model.id = null;
    this.model.description = null;
  }

}
