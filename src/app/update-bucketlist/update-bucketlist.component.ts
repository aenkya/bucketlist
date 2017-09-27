import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';

import { User } from '../shared/models/user';
import { UserService } from '../shared/user.service';


@Component({
  selector: 'app-update-bucketlist',
  templateUrl: './update-bucketlist.component.html',
  styleUrls: ['./update-bucketlist.component.scss'],
  providers: [BucketlistService, UserService]
})
export class UpdateBucketlistComponent implements OnInit {
  model: any = {};
  loading = false;
  @Input() complete;
  @Input() length;
  @Input() bucketlist_id;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  public subjects: User[];
  public authUser: User[];
  submitted = false;
  private errorMessage;
  error;
  file_true: Boolean = true;
  timer;
  id: any;
  isChecked = true;
  success = false;

  constructor(
    private bucketlistService: BucketlistService,
    public dialogRef: MdDialogRef<UpdateBucketlistComponent>,
    public snackBar: MdSnackBar,
    private userService: UserService
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = currentUser && currentUser.id;
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUser(this.id)
    .subscribe(result => {
            if (result === true) {
              this.authUser = this.userService.authUser;
            }
    });
  }

  stringAsDate(dateStr) {
    return new Date(dateStr);
  }

  checkForComplete(): void {
    if (this.complete) {
      this.timer = setTimeout(this.UpdateBucketlist(), 20);
    }
  }

  UpdateBucketlist(): void {
    this.submitted = true;
    this.loading = !this.loading;
    const today = Date.now();
    this.model.completed_at = today;
    this.model.length = this.length;
    this.model.bucketlist_id = this.bucketlist_id;

    this.bucketlistService.updateBucketlist(this.model)
        .subscribe(
          result => {
            if (result === true) {
              this.timer = setTimeout(this.onLoad(), 3000);
              this.sendCloseNotification();
            }
          },
          errMsg => {
            this.errorMessage = errMsg;
            this.timer = setTimeout(this.onLoad(), 3000);
          }
        );
    return this.stopTimer();
  }

  sendCloseNotification() {
    this.notifyParent.emit(true);
  }

  onLoad () {
    this.loading = !this.loading;
    if (this.error) {
      this.success = false;
      this.openSnackBar('Failed', 'RETRY');
    } else {
      this.success = true;
      this.openSnackBar('Bucketlist updated', 'UNDO');
    }
  }

  stopTimer() {
      if (this.timer) {
          clearTimeout(this.timer);
      }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
