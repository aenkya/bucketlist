import { Component, Input, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-confirm-dialog',
    template: ``,
})
export class UpdateDialog {

  complete = false;
  length: any;
  bucketlist_id: string;

  constructor(
    public dialogRef: MdDialogRef<UpdateDialog>
    ) {}

  markAsComplete() {
    this.complete = true;
  }

  closeDialog(evt) {
    if ( evt === true) {
      this.dialogRef.close();
    }
  }

}
