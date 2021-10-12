import { ReportService } from 'src/app/services/reports/report.service';
import { Component, OnInit,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reportero } from '../../types';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-inforeport-edit',
  templateUrl: './inforeport-edit.component.html',
  styleUrls: ['./inforeport-edit.component.scss']
})
export class InforeportEditComponent implements OnInit {

  constructor(private reportService:ReportService,public dialogRef:MatDialogRef<InforeportEditComponent>, @Inject(MAT_DIALOG_DATA)public data:any,private http:HttpClient, private snackbar:MatSnackBar) {
    this.recuperarReport();
   }
  public idCuenta=this.data;

  ngOnInit(): void {
  }
  private serverDirection :string = 'http://localhost:3000';

public idReport:string="";
public nombreReport:string="";
public apepatReport:string="";
public fechaPubli:string="";
public idNotice:string=this.idCuenta;
public titleNotice:string="";
public coverImage : string = '';
public idUltimaModif:string;


  async recuperarReport(){
    let notice=await this.reportService.getReport(this.idCuenta);
    
    console.log("servicio");
    console.log(notice[0]);
    this.idReport=notice[0].id_reportero;
    this.nombreReport=notice[0].nombrereportero;
    this.apepatReport=notice[0].apepareportero;
    this.fechaPubli=notice[0].fecha_publicacion;
    this.titleNotice=notice[0].titulo;
    this.coverImage=notice[0].imagen;
    this.idUltimaModif=notice[0].ultima_modificacion;

    if(this.idUltimaModif==null){this.idUltimaModif="-"}
  }

  close(){
    this.dialogRef.close();
  }
}
