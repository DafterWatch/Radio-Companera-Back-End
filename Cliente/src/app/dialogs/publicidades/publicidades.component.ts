import { PublicidadService } from 'src/app/services/publicidades/publicidad.service';
import { UserService } from 'src/app/services/userService/user.service';
import { Reportero } from 'src/app/types';
import { PublicidadContent } from './../../types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Publicidad } from 'src/app/types';

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
  estado=true;

  //Datos extras
  currentReporter : Reportero;
  publicidadesHabiles;
  publicidadOld;

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
      const [typeFile, format]:[string,string] = archivo.type.split('/');
      if(['image'].includes(typeFile)){
      this.fotoPublicidad= await this.http.post(`http://localhost:3000/subirArchivo/`,formData,{responseType:"text"}).toPromise()//.subscribe(resultado=>this.fotoperfil=resultado);
      }else{
        this.snackBar.open("Seleccione una imagen: .jpg, .png, .gif");
      }
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
      imagepublicidad:this.fotoPublicidad,
      estado:this.estado
    }
    this.getPublcidadHabiles();

    console.log(publicidadNueva);
    let status=await this.publicidadService.createPublicidad(publicidadNueva);
if(status){this.snackBar.open("Registro exitos","Ok");this.dialogRef.close();this.getPublcidadHabiles();}
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
