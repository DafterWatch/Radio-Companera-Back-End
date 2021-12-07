import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PublicidadesComponent } from './../dialogs/publicidades/publicidades.component';
import { comunicacionComponentesService } from './../services/comunicacionComponentesService/comunicacionComponentes.service';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Publicidad } from '../types';
import { ReportService } from 'src/app/services/reports/report.service';
import { MatDialog } from '@angular/material/dialog';
import { EditPublicidadComponent } from '../dialogs/publicidades/edit-publicidad/edit-publicidad.component';

const publicidades: Publicidad[] = [
  /*{id_publicidad: 1, titulo: 'Titulo 1', empresa: 'Empresa 1', autor: 'Autor 1', fechainicio:'01/10/2021', fechafin:'05/10/2021',estado:true},
  {id_publicidad: 2, titulo: 'Titulo 2', empresa: 'Empresa 2', autor: 'Autor 2', fechainicio:'06/10/2021', fechafin:'10/10/2021',estado:false},
  {id_publicidad: 3, titulo: 'Titulo 3', empresa: 'Empresa 3', autor: 'Autor 3', fechainicio:'11/10/2021', fechafin:'15/10/2021',estado:true},
  {id_publicidad: 4, titulo: 'Titulo 4', empresa: 'Empresa 4', autor: 'Autor 4', fechainicio:'16/10/2021', fechafin:'20/10/2021',estado:false},
  {id_publicidad: 5, titulo: 'Titulo 5', empresa: 'Empresa 5', autor: 'Autor 5', fechainicio:'21/10/2021', fechafin:'25/10/2021',estado:true},*/
];

@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.scss']
})
export class PublicidadComponent implements OnInit {
  displayedColumns: string[] = ['id_publicidad', 'Titulo', 'Empresa', 'Autor', 'Fecha activa', 'Estado', 'Modificar'];
  dataSource;
  numeroEntradas;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private comunicacion:comunicacionComponentesService,private dialog:MatDialog,private http:HttpClient, private reportService : ReportService) { 
    this.setDataSource();
    this.nroPagina=1;
    this.nroItem=0;
  }

  ngOnInit(): void {
  }
  addPublicidad(){
    this.dialog.open(PublicidadesComponent);
  }
  EditPublicidad(idPubli :string){
this.comunicacion.SetIDPublicidad(idPubli);
    this.dialog.open(EditPublicidadComponent);
  }

  async setDataSource(): Promise<void>{
    await this.reportService.getEntradasPublicidad().then((data:Publicidad[])=>{
      
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.numeroEntradas=data.length;
      
    })
  }
  async buscarTitulo(titulo:string): Promise<void>{
    await this.reportService.getEntradasPublicidadTitulo(titulo).then((data:Publicidad[])=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.numeroEntradas=data.length;
    })
  }
  async buscarEmpresa(empresa:string): Promise<void>{
    await this.reportService.getEntradasPublicidadEmpresa(empresa).then((data:Publicidad[])=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.numeroEntradas=data.length;
    })
  }
  async buscarFecha(fecha:string): Promise<void>{
    await this.reportService.getEntradasPublicidadFecha(fecha).then((data:Publicidad[])=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.numeroEntradas=data.length;
    })
  }

  nroPagina:number;
  nroItem:number;

  paginacion():string{
    return "Página: "+Math.ceil(this.nroPagina)+" de: "+Math.ceil(this.dataSource.length/5);
  }
 

}
