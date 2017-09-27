import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../shared/auth.service';

import { User } from '../shared/models/user';

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  payLoad = '';
  model: any = {};
  loading = false;
  error = '';
  users: User[] = [];
  timer;
  success = false;

  constructor(
    private authService: AuthService,
    public snackBar: MdSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.logout();
  }

  register() {
    this.loading = true;
    this.authService.register(this.model)
        .subscribe(result => {
            this.resetValues();
            if (result === true) {
              this.timer = setTimeout(this.onLoad(), 3000);
            }
        },
        errMsg => {
            this.error = errMsg;
            this.loading = false;
        });
  }

  resetValues(): void {
    this.model = null;
  }

  onLoad () {
      this.loading = !this.loading;
      if (this.error) {
        this.success = false;
        this.openSnackBar(this.error, 'RETRY');
      } else {
        this.success = true;
        this.openSnackBar('User Created', 'UNDO');
        setTimeout(this.router.navigate(['/login']), 1000);
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
