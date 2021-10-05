import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ReportService } from 'src/app/services/reports/report.service';
@Component({
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.scss']
})
export class AddTagDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddTagDialogComponent>,
    public reportService : ReportService
  ) { }

  ngOnInit(): void {
  }
  closeDialog() : void{
    this.dialogRef.close();
  }
  async addCategory(catName : string) : Promise<void>{
    let status = await this.reportService.createCategoria(catName);
    if(!status){
      alert("Error creando noticia");
    }
  }
}
