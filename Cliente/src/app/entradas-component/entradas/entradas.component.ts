import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/userService/user.service';
import { ReportService } from 'src/app/services/reports/report.service';
import { comunicacionComponentesService } from 'src/app/services/comunicacionComponentesService/comunicacionComponentes.service';
import { Permisos, Entradas, Reportero } from '../../types';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit {

  currentReporter:Reportero;
  constructor(private http:HttpClient, private userService : UserService, private reportService : ReportService, private _snackBar: MatSnackBar, private ComunicacionComponentesService:comunicacionComponentesService, private router: Router) {  
    userService.getReportero().subscribe((_reportero : Reportero)=>{
      this.permisos = userService.getPermisos();
    });
    this.userService.getReportero().subscribe((_reportero:Reportero)=>this.currentReporter=_reportero);

    this.categoriaSelect="";
    this.setDataSource();
    this.nroPagina=1;
    this.nroItem=0;
    this.reportService.getCategorias().then((_categoria:string[])=>this.categorias=_categoria);
  }

  async setDataSource(): Promise<void>{
    await this.reportService.getEntradas().then((data:Entradas[])=>{
      this.dataSource=data
      
      this.cargarPaginacion();
    })
  }
  
  permisos : Permisos;
  categorias: string[] = [];
  NOTICIA_DATA: Promise<Entradas[]>;
  dataTabla:Entradas[]

  displayedColumns: string[] = ['ID', 'Titulo', 'Autor', 'Etiqueta', 'Fecha', 'Estado', 'Cambiar'];
  dataSource:Entradas[];

  cargarPaginacion():void{
    this.dataTabla=[this.dataSource[this.nroItem],this.dataSource[this.nroItem+1],this.dataSource[this.nroItem+2],this.dataSource[this.nroItem+3],this.dataSource[this.nroItem+4]];
  }

  async buscarTitulo(titulo:string): Promise<void>{
    if(titulo!=""){
      await this.reportService.getBuscarEntradas(titulo).then((data:Entradas[])=>{
      
        this.dataSource=data
        this.cargarPaginacion();
      })
    }
    else{
      this.openSnackBar("No se ingreso el título.", "Aceptar");
    }
  }
  async filtrarFecha(fecha:string): Promise<void>{
    if(fecha!=""){
      await this.reportService.getFiltarEntradasFecha(fecha).then((data:Entradas[])=>{
      
        this.dataSource=data
        this.cargarPaginacion();
      })
    }
    else{
      this.openSnackBar("No se ingreso la fecha.", "Aceptar");
    }
  }
  categoriaSelect:string;
  async filtrarCategoria(): Promise<void>{
    if(this.categoriaSelect!=""){
      await this.reportService.getFiltarEntradasCategoria(this.categoriaSelect).then((data:Entradas[])=>{
      
        this.dataSource=data
        this.cargarPaginacion();
      })
    }
    else{
      this.openSnackBar("No se ingreso la categoría.", "Aceptar");
    }
  }

  permisosModificar(id:string):boolean{

    if(id==this.currentReporter.id_reportero){
      return true;
    }
    else{
      if(this.permisos.MODIFICAR_NOTICIAS_AJENAS){
        return true;
      }
      else{
        return false;
      }
    }
  }

  numeroEntradas():string{
    return this.dataSource.length+" elementos";
  }
  nroPagina:number;
  nroItem:number;
  paginacion():string{
    return "Página: "+Math.ceil(this.nroPagina)+" de: "+Math.ceil(this.dataSource.length/5);
  }
  dosPaginasAtras():void{
    if(this.nroPagina>2){
      this.nroPagina-=2;
      this.nroItem-=10;
    }
    else{
      this.nroPagina=1;
      this.nroItem=0;
    }
    this.cargarPaginacion();
  }
  unaPaginasAtras():void{
    if(this.nroPagina>1){
      this.nroPagina-=1;
      this.nroItem-=5;
    }
    this.cargarPaginacion();
  }
  dosPaginasAdelante():void{
    if(this.nroPagina<(this.dataSource.length/5)-2){
      this.nroPagina+=2;
      this.nroItem+=10;
    }
    else{
      this.nroPagina=this.dataSource.length/5;
      this.nroItem=this.dataSource.length-5;
    }
    this.cargarPaginacion();
  }
  unaPaginasAdelante():void{
    if(this.nroPagina<this.dataSource.length/5){
      this.nroPagina+=1;
      this.nroItem+=5;
    }
    this.cargarPaginacion();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
  }
  
  

  modificarEntrada(id_noticia:string):void{
    this.ComunicacionComponentesService.setIDEntrada(id_noticia);
    this.router.navigate(['/entradas/edit']);
  }
  mandarAddEntrada(){
    this.router.navigate(['/nueva-entrada']);
  }
}