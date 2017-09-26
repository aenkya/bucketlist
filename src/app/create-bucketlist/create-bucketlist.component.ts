import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Bucketlist } from '../shared/models/bucketlist';
import { BucketlistService } from '../shared/bucketlist.service';

import { User } from '../shared/models/user';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-create-bucketlist',
  templateUrl: './create-bucketlist.component.html',
  styleUrls: ['./create-bucketlist.component.scss'],
  providers: [BucketlistService, UserService]
})
export class CreateBucketlistComponent implements OnInit {

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  model: any = {};
  start_date: number;
  loading = false;
  confirmation = 'Bucketlist Created';
  action = 'Undo';
  public authUser: User[];
  private id: any;
  private today: number;
  color = 'secondary';
  checked: boolean;
  submitted = false;
  private errorMessage;
  error;
  timer;
  success = false;

  constructor(
    private bucketlistService: BucketlistService,
    public snackBar: MdSnackBar,
    private userService: UserService,
    private router: Router
  ) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = currentUser && currentUser.id;
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.today = Date.now();
    setInterval(() => {
      this.today = Date.now();
    }, 100);
  }

  getUserDetails() {
    this.userService.getUser(this.id)
    .subscribe(result => {
            if (result === true) {
                this.authUser = this.userService.authUser;
            }
                this.loading = false;
            });
  }

  stringAsDate(dateStr) {
    return new Date(dateStr);
  }

  onSubmit() {
    this.submitted = true;
    this.model.date_created = this.today;
    this.model.date_modified = this.today;
    this.model.created_by = this.authUser[0].id;
    this.loading = !this.loading;

    this.bucketlistService.createBucketlist(this.model)
        .subscribe(result => {
            if (result === true) {
              this.timer = setTimeout(this.onLoad(), 3000);
              this.sendCloseNotification();
            }
        },
        errMsg => {
          this.error = errMsg;
          this.timer = setTimeout(this.onLoad(), 3000);
        });
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
        this.openSnackBar('Bucketlist Created', 'UNDO');
        setTimeout(this.router.navigate(['/']), 1000);
      }
  }

  stopTimer() {
      if (this.timer) {
          clearTimeout(this.timer);
      }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, 'UNDO', {
      duration: 2000,
    });
  }

}
