import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.scss']
})
export class AddTagDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddTagDialogComponent>
  ) { }

  ngOnInit(): void {
  }
  closeDialog() : void{
    this.dialogRef.close();
  }

}
