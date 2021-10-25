import { Publicidad } from './../../../types';
import { comunicacionComponentesService } from './../../../services/comunicacionComponentesService/comunicacionComponentes.service';
import { UserService } from 'src/app/services/userService/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { PublicidadService } from 'src/app/services/publicidades/publicidad.service';
import { PublicidadContent, Reportero } from 'src/app/types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-publicidad',
  templateUrl: './edit-publicidad.component.html',
  styleUrls: ['./edit-publicidad.component.scss']
})
export class EditPublicidadComponent implements OnInit {

  panelOpenState = false;

   //Datos de publicidad
   idPublicidad:string;
   fotoPublicidad:string='';
   titleModel:string='';
   empresModel:string='';
   enlaceModel:string='';
   fechStart:Date;
   fechEnd:Date;

     //Datos extras
  currentReporter : Reportero;
  idReporteroPublicidad:string;
  nombreReportero:string;
  apepaterno:string;
  apematerno:string;

  estadoPubli;
  publicidadesHabiles;
  stringEstado="Activa";
  publicidadOld;

  constructor(private comunicacion:comunicacionComponentesService,private dialogRef:MatDialogRef<EditPublicidadComponent>,private publicidadService:PublicidadService,private http:HttpClient,private snackBar:MatSnackBar,private userService:UserService) { 
    this.userService.getReportero().subscribe((_reportero : Reportero)=> this.currentReporter = _reportero);

    this.idPublicidad=comunicacion.getIDPublicidad();
    this.getPublicidad();

  }
  async getPublicidad(){
    let publicidadActual= await this.publicidadService.getPublicidad(this.idPublicidad).then();
   console.log(publicidadActual[0]);
    
    
    
    this.titleModel=publicidadActual[0].titulo;
    this.empresModel=publicidadActual[0].empresa;
    this.enlaceModel=publicidadActual[0].enlace;
    /*
    this.fechStart=publicidadActual[0].fechainicio;
    this.fechEnd=publicidadActual[0].fechafin;
    */
    
    this.fechStart=publicidadActual[0].fechainicio;
    this.fechEnd=publicidadActual[0].fechafin;
    this.fotoPublicidad=publicidadActual[0].imagepublicidad;
    this.estadoPubli=publicidadActual[0].estado;
    if(this.estadoPubli){    this.stringEstado="Activa"; document.getElementById("estadotrue").style.backgroundColor="rgb(70, 143, 86)";}
    else{    this.stringEstado="Inactiva";document.getElementById("estadotrue").style.backgroundColor="rgb(199, 97, 97)";}


    //Recuperar reportero encargado
    this.idReporteroPublicidad=publicidadActual[0].id_reportero;
    this.nombreReportero=publicidadActual[0].nombres;
    this.apepaterno=publicidadActual[0].apepaterno;
    this.apematerno=publicidadActual[0].apematerno;

  }

  ngOnInit(): void {
  }

  updateState(){
   
    if(this.stringEstado=="Activa"){
      this.stringEstado="Inactiva"
      document.getElementById("estadotrue").style.backgroundColor="rgb(199, 97, 97)";
    }else{
      this.stringEstado="Activa"
      
      document.getElementById("estadotrue").style.backgroundColor="rgb(70, 143, 86)";
    }
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
  async EditarPublicidad(){
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
    if(this.fotoPublicidad===""){
      this.snackBar.open("Seleccione un imagen para la publicidad","Ok")
      return;
    }
    if(this.fechStart===null){
      this.snackBar.open("Seleccione un fecha de inicio para la publicidad","Ok")
      return;
    }
    if(this.fechEnd===null){
      this.snackBar.open("Seleccione un fecha de fin para la publicidad","Ok")
      return;
    }
    let publicidadNueva : PublicidadContent={
      id_reportero:this.currentReporter.id_reportero,
      titulo:this.titleModel,
      empresa:this.empresModel,
      enlace:this.enlaceModel,
      fechainicio:this.fechStart,
      fechafin:this.fechEnd,
      imagepublicidad:this.fotoPublicidad,
      estado:this.estadoPubli
    }

    console.log(publicidadNueva);
    let status=await this.publicidadService.updatePublicidad(this.idPublicidad,publicidadNueva);
if(status){this.snackBar.open("Modificacion exita","Ok");this.dialogRef.close();this.getPublcidadHabiles();}
  }
  async getPublcidadHabiles(): Promise<void>{
    await this.publicidadService.getPublcidadHabiles().then((data:Publicidad[])=>{
      this.publicidadesHabiles=data;

      while(this.publicidadesHabiles>2){
        this.getPubliOld();
        this.publicidadesHabiles=this.publicidadesHabiles-1;
        console.log("Ahora"+ this.getPublcidadHabiles);
      }
    })
  }
  async getPubliOld(){
    await this.publicidadService.getPubliOld().then((data:Publicidad[])=>{
      this.publicidadOld=data;
      console.log(this.publicidadOld[0].id_publicidad);
      this.desHabilitarPublicOld(this.publicidadOld[0].id_publicidad);
    })
  }
  async desHabilitarPublicOld(idPubliOld){
    console.log("Deshabilitar: "+idPubliOld);
    this.snackBar.open("Publicidad registrada - - ­\n Publicidad: "+idPubliOld+ " deshabilitada","Ok");
    await this.publicidadService.desHabilitarPubli(idPubliOld);
  }
  close(){
    this.dialogRef.close();
  }
}
