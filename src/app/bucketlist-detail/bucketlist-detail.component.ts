import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import {MdDialog, MdSnackBar, MdTooltip} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';
import {DialogsService} from '../shared/core/dialogs.service';

import { User } from '../shared/models/user';
import { Item } from '../shared/models/item';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-bucketlist-detail',
  templateUrl: './bucketlist-detail.component.html',
  styleUrls: ['./bucketlist-detail.component.scss'],
  providers: [BucketlistService, UserService]
})
export class BucketlistDetailComponent implements OnInit {
  bucketlist: Bucketlist;
  items: Item[];
  public authUser: User[];
  model: any = {};
  itemModel: any = {};
  public result: any;
  loading = false;
  feedLoading = false;
  noItems = false;
  errorMessage: any;
  id;
  bucketlist_id: number;
  edit = false;
  editItem: number;

  constructor(
    private bucketlistService: BucketlistService,
    private userService: UserService,
    public dialog: MdDialog,
    private router: Router,
    private dialogService: DialogsService,
    private _route: ActivatedRoute,
    private snackBar: MdSnackBar,
    private _location: Location
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = currentUser && currentUser.id;
  }

  ngOnInit(): void {
    this.authUser = this.userService.authUser;
    this.getBucketlist();
    this.getItems();
  }

  getBucketlist(): void {
    this.bucketlist_id = +this._route.snapshot.params['id'];
    this.bucketlistService.getBucketlist(this.bucketlist_id).subscribe(
      res => {
        this.bucketlist = res;
        if (res.items.length === 0) {
          this.noItems = true;
        }
      },
      error => {
        this.feedLoading = !this.feedLoading;
        this.noItems = true;
        this.errorMessage = error;
      });
  }

  getItems() {
    this.feedLoading = !this.feedLoading;
    this.bucketlist_id = +this._route.snapshot.params['id'];
    return this.bucketlistService.getItems(this.bucketlist_id).subscribe(
      res => {
        this.feedLoading = !this.feedLoading;
        this.items = res;
        if (res.length === 0) {
          this.noItems = true;
        }
      },
      error => {
        this.feedLoading = !this.feedLoading;
        this.noItems = true;
        this.errorMessage = error;
      });
  }

  addItem() {
    this.model.bucketlist_id = this.bucketlist_id;
    this.bucketlistService.addItem(this.model).subscribe(
      res => {
        this.resetValues();
        if (res === true) {
          this.getItems();
        }
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  openDialog(componentName, item_id) {
    switch (componentName) {
      case 'delete':
        this.dialogService
            .confirm('Confirm Dialog', 'Are you sure you want to delete the item?')
            .subscribe(res => {
              res === true ? this.delete(item_id) : res = this.result;
            });
        break;

      case 'deleteAll':
        this.dialogService.confirm('Confirm Dialog', 'Are you sure you want to delete all bucketlist items?')
            .subscribe(res => {
              res === true ? this.deleteAll() : res = this.result;
            });
        break;

      default:
        break;
    }
  }

  delete(item_id: number, many = false) {
    const itemModel: any = {};
    itemModel.bucketlist_id = this.bucketlist_id;
    itemModel.id = item_id;
    return this.bucketlistService.deleteItem(itemModel).subscribe(res => {
      if (res) {
        if (!many) {
          this.snackBar.open('Item Deleted', 'UNDO', {duration: 2000});
          this.getItems();
        }
      }
    });
  }

  deleteAll() {
    for (let i = 0; i < this.items.length; i++) {
      this.delete(this.items[i].id, true);
    }
    this.snackBar.open('All Items Deleted', 'UNDO', {duration: 2000});
    this.getItems();
  }

  checkItem(item: any) {
    return (item === undefined || item.length === 0) ? false : true;
  }

  toggleEdit(item = null) {
    this.editItem = item;
    this.edit = !this.edit;
  }

  updateItem(item_id, completed = null, sweep = false) {
    this.loading = !this.loading;
    this.itemModel.bucketlist_id = this.bucketlist_id;
    this.itemModel.id = item_id;
    if (completed !== null) {
      if (sweep) {
        this.itemModel.done = true;
      } else {
        this.itemModel.done = !completed;
      }
    }
    this.bucketlistService.updateItem(this.itemModel).subscribe(res => {
        this.resetValues();
        if (res === true) {
          this.loading = !this.loading;
          this.getItems();
          this.toggleEdit();
        }
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  toggleCompletion(item: Item) {
    this.updateItem(item.id, item.done);
  }

  completeAll() {
    for (let i = 0; i < this.items.length; i++) {
      this.updateItem(this.items[i].id, true, true);
    }
  }

  resetValues(): void {
    this.model.name = null;
    this.itemModel.name = null;
  }

  back() {
    this._location.back();
  }
}
