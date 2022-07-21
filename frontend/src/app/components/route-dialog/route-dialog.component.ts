import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

export interface DialogData {
  routeTitle: string;
  isPrivate: boolean;
}

@Component({
  selector: 'app-route-dialog',
  templateUrl: './route-dialog.component.html',
  styleUrls: ['./route-dialog.component.scss']
})
export class RouteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RouteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  ngOnInit(): void {
  }

  changeCheckbox(event: any) {
    this.data.isPrivate = event.checked;
  }

  isTitleTooShort(): boolean {
    return this.data.routeTitle.trim().length < 2;
  }

  onDiscardClick() {
    return this.dialogRef.close();
  }
}
