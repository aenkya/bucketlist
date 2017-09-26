import { Component, Input, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <app-create-bucketlist (notifyParent)="closeDialog($event)" ></app-create-bucketlist>
  `,
})
export class CreateDialog {

  constructor(
    public dialogRef: MdDialogRef<CreateDialog>
  ) {}

  closeDialog(evt) {
    if (evt === true) {
      this.dialogRef.close();
    }
  }

}
