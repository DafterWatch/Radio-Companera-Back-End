import { PublicidadService } from 'src/app/services/publicidades/publicidad.service';
import { UserService } from 'src/app/services/userService/user.service';
import { Reportero } from 'src/app/types';
import { PublicidadContent } from './../../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-publicidades',
  templateUrl: './publicidades.component.html',
  styleUrls: ['./publicidades.component.scss']
})
export class PublicidadesComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl('',Validators.required),
    end: new FormControl('',Validators.required)
  });

  //Datos de publicidad
  fotoPublicidad:string='';
  titleModel:string='';
  empresModel:string='';
  enlaceModel:string='';

  //Datos extras
  currentReporter : Reportero;

  constructor(private dialogRef:MatDialogRef<PublicidadesComponent>,private publicidadService:PublicidadService,private http:HttpClient,private snackBar:MatSnackBar,private userService:UserService) { 
    this.userService.getReportero().subscribe((_reportero : Reportero)=> this.currentReporter = _reportero);
  }

  ngOnInit(): void {
  }

  cargarFotoPerfil(){
    var fotoPerfil:any;
    fotoPerfil=document.getElementById("fotoPerfil");
     fotoPerfil.onchange= async ()=> {
      var archivo=fotoPerfil.files[0];
      const formData:FormData=new FormData();
      formData.append("clientFile",archivo);
      this.fotoPublicidad= await this.http.post(`http://localhost:3000/subirArchivo/`,formData,{responseType:"text"}).toPromise()//.subscribe(resultado=>this.fotoperfil=resultado);
      
    };
    fotoPerfil.click();
  }

  async SubirPublicidad(){
    if(this.titleModel===""){
      this.snackBar.open("El titulo es requerido","Ok");
      return;
    }
    if(this.empresModel===""){
      this.snackBar.open("La empresa es requerida","Ok");
      return;
    }
    if(this.enlaceModel===""){
      this.snackBar.open("El enlace es requerido","Ok");
      return;
    }
    if(!this.range.valid){
      this.snackBar.open("Seleccione fechas de duración validas","Ok")
      return;
    }
    if(this.fotoPublicidad===""){
      this.snackBar.open("Seleccione un imagen para la publicidad","Ok")
      return;
    }
    const value = this.range.value;
    let publicidadNueva : PublicidadContent={
      id_reportero:this.currentReporter.id_reportero,
      titulo:this.titleModel,
      empresa:this.empresModel,
      enlace:this.enlaceModel,
      fechainicio:value.start,
      fechafin:value.end,
      imagepublicidad:this.fotoPublicidad
    }

    console.log(publicidadNueva);
    let status=await this.publicidadService.createPublicidad(publicidadNueva);
if(status){this.snackBar.open("Registro exitos","Ok");this.dialogRef.close();}
  }

  close(){
    this.dialogRef.close();
  }

}
