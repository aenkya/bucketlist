import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MdDialog} from '@angular/material';
import { Router } from '@angular/router';

import { User } from '../shared/models/user';
import { UserService } from '../shared/user.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {

  public authUser: User[];
  private errorMessage: any;
  public loading: boolean;
  private id: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    public dialog: MdDialog,
    private router: Router
  ) {
     this.loading = false;
     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
     this.id = currentUser && currentUser.id;
  }

  ngOnInit(): void {
    this.getUserDetails(this.id);
  }

  getUserDetails(id: any) {
    this.userService.getUser(id)
    .subscribe(result => {
            if (result === true) {
                this.authUser = this.userService.authUser;
            }
        },
        error => {
          this.errorMessage = error;
      });
  }

  checkItem(item: any) {
    return (item === undefined || item.length === 0) ? false : true;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}