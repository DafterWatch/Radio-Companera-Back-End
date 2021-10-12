import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/userService/user.service';
import { ReportService } from 'src/app/services/reports/report.service';
import { comunicacionComponentesService } from 'src/app/services/comunicacionComponentesService/comunicacionComponentes.service';
import { Permisos, Entradas, Reportero } from '../../types';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss']
})
export class EntradasComponent implements OnInit {

  currentReporter:Reportero;
  constructor(private http:HttpClient, private userService : UserService, private reportService : ReportService, private _snackBar: MatSnackBar, private ComunicacionComponentesService:comunicacionComponentesService) {  
    this.userService.getReportero().subscribe((_reportero:Reportero)=>this.currentReporter=_reportero);
    this.categoriaSelect="";
    this.setDataSource();
    this.nroPagina=1;
    this.reportService.getCategorias().then((_categoria:string[])=>this.categorias=_categoria);
  }

  async setDataSource(): Promise<void>{
    this.permisos = await this.userService.getPermisos();
    await this.reportService.getEntradas().then((data:Entradas[])=>{
      
      this.dataSource=data;
    })
  }
  
  permisos : Permisos;
  categorias: string[] = [/*
    {nombre: 'Categoria1'},
    {nombre: 'Categoria2'}*/
  ];
  NOTICIA_DATA: Promise<Entradas[]>;

  displayedColumns: string[] = ['ID', 'Titulo', 'Autor', 'Etiqueta', 'Fecha', 'Estado', 'Cambiar'];
  dataSource:Entradas[];

  async buscarTitulo(titulo:string): Promise<void>{
    if(titulo!=""){
      await this.reportService.getBuscarEntradas(titulo).then((data:Entradas[])=>{
      
        this.dataSource=data
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
      })
    }
    else{
      this.openSnackBar("No se ingreso la categoría.", "Aceptar");
    }
  }

  permisosModificar(id:string):boolean{
    /*if(id==this.currentReporter.id_reportero){
      return true;
    }
    else{
      if(this.permisos.MODIFICAR_NOTICIAS_AJENAS){
        return true;
      }
      else{
        return false;
      }
    }*/
    return true;
  }

  numeroEntradas():string{
    return this.dataSource.length+" elementos";
  }
  nroPagina:number;
  paginacion():string{
    return "Página: "+this.nroPagina+" de: "+this.dataSource.length/5;
  }
  dosPaginasAtras():void{
    if(this.nroPagina>2){
      this.nroPagina-=2;
    }
    else{
      this.nroPagina=1;
    }
  }
  unaPaginasAtras():void{
    if(this.nroPagina>1){
      this.nroPagina-=1;
    }
  }
  dosPaginasAdelante():void{
    if(this.nroPagina<(this.dataSource.length/5)-1){
      this.nroPagina+=2;
    }
    else{
      this.nroPagina=this.dataSource.length/5;
    }
  }
  unaPaginasAdelante():void{
    if(this.nroPagina<this.dataSource.length/5){
      this.nroPagina+=1;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
  }
  
  

  modificarEntrada(id_noticia:string):void{
    this.ComunicacionComponentesService.setIDEntrada(id_noticia);
    console.log(this.ComunicacionComponentesService.getIDEntrada());
  }
}