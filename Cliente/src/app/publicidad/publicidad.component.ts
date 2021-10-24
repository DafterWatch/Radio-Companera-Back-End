import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, OnInit } from '@angular/core';

export interface Publicidad {
  id_publicidad: number;
  titulo: string;
  empresa: string;
  autor: string;
  fechainicio:string;
  fechafin:string;
  estado:boolean;
}
const publicidades: Publicidad[] = [
  {id_publicidad: 1, titulo: 'Titulo 1', empresa: 'Empresa 1', autor: 'Autor 1', fechainicio:'01/10/2021', fechafin:'05/10/2021',estado:true},
  {id_publicidad: 2, titulo: 'Titulo 2', empresa: 'Empresa 2', autor: 'Autor 2', fechainicio:'06/10/2021', fechafin:'10/10/2021',estado:false},
  {id_publicidad: 3, titulo: 'Titulo 3', empresa: 'Empresa 3', autor: 'Autor 3', fechainicio:'11/10/2021', fechafin:'15/10/2021',estado:true},
  {id_publicidad: 4, titulo: 'Titulo 4', empresa: 'Empresa 4', autor: 'Autor 4', fechainicio:'16/10/2021', fechafin:'20/10/2021',estado:false},
  {id_publicidad: 5, titulo: 'Titulo 5', empresa: 'Empresa 5', autor: 'Autor 5', fechainicio:'21/10/2021', fechafin:'25/10/2021',estado:true},
];

@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.scss']
})
export class PublicidadComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Titulo', 'Empresa', 'Autor', 'Fecha activa', 'Estado', 'Modificar'];
  dataSource = publicidades;

  constructor() { }

  ngOnInit(): void {
  }

  nuevaPublicidad():void{
    console.log("Ir componenete nueva publicidad")
  }
}
