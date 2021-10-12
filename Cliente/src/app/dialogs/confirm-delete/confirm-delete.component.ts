import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { comunicacionComponentesService } from './../../services/comunicacionComponentesService/comunicacionComponentes.service';
import { ReportService } from 'src/app/services/reports/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  idNoticia:any=this.comunService.getIDEntrada();
  constructor(private reportService:ReportService,private comunService:comunicacionComponentesService,public dialogRef:MatDialogRef<ConfirmDeleteComponent>,private snackBar:MatSnackBar) {
    this.recuperarReport();
   }

  ngOnInit(): void {
  }
  htmlContent : string='';
  coverImage : string = '';
  tagsModel : string ='';
  titleModel : string = '';
  idReportEncargado:string;
  fecha_publicacion:string;

  close(){
    this.dialogRef.close();
  }
  async recuperarReport(){
    let notice=await this.reportService.getReport(this.idNoticia);
    
    console.log("servicio");
    console.log(notice[0]);

    this.titleModel=notice[0].titulo;
    this.htmlContent=notice[0].contenido;
    this.coverImage=notice[0].imagen;
    this.idReportEncargado=notice[0].id_reportero;
    this.fecha_publicacion=notice[0].fecha_publicacion;
    
  }
  async deleteReport(): Promise<void>{
    let state =await this.reportService.deshabilitarNotice(this.idNoticia);
if(state){this.openSnackBar("Noticia deshabilitada");}
  }
  openSnackBar(messaje:string) {
    this.snackBar.open(messaje, 'Listo!', {
      horizontalPosition:'center',
      verticalPosition: 'top',
    });
  }

}
