import { SnackBarExampleComponent } from './../dialogs/snack-bar-example/snack-bar-example.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportService } from 'src/app/services/reports/report.service';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ClipboardModule} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.scss']
})

export class EscritorioComponent implements OnInit {


  roomsFilter;
  valorFiltro:string="";
  fechaFiltro:Date;
  dataSource; Cantidad=0;
  displayedColumns: string[] = ['id_reportero', 'nombre', 'cargo', 'titulo', 'id_noticia', 'fecha_publicacion'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.setDataSource();    
    
  }
  constructor(public reportService:ReportService,private _snackBar:MatSnackBar) { }
  
  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    await this.reportService.getHistorialGeneral().then((data)=>{
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.Cantidad=data.length;
    })
  }
  public async DataSourceReportero(): Promise<void>{
    console.log(this.valorFiltro);
    let vreport=this.valorFiltro.trim();
    await this.reportService.getHistorialFilter(vreport).then((data)=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.Cantidad=data.length;
    })
  }

  public onDate(event): void {
    this.roomsFilter.date = event;
    console.log(this.roomsFilter.date);
  }

  public async DataSourceFecha(): Promise<void>{
    
    console.log(this.fechaFiltro.toDateString());
    let fecha=this.fechaFiltro.toDateString();
    if(this.fechaFiltro!=null){
      await this.reportService.getHistorialFilterDate(fecha).then((data)=>{
        this.dataSource=new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.Cantidad=data.length;
      })
    }
    
  }

  
  public async setDataSource(): Promise<void>{
    await this.reportService.getHistorialGeneral().then((data)=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.Cantidad=data.length;
    })
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarExampleComponent, {
      duration: 2000
    });
}
  copiarAlPortapapeles(id_elemento) {
    console.log(id_elemento);
    this.openSnackBar();
    var aux = document.createElement("input");
    aux.setAttribute("value", document.getElementById(id_elemento).innerHTML);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }

  limpiar(){
    this.valorFiltro=""
    this.setDataSource();
  }
}
export interface dateHistorial{
  id_noticia:string,
  id_reportero:string,
  nombre:string,
  cargo:string,
  titulo:string,
  fecha_publicacion:Date,
  ultima_modificacion:Date
}
