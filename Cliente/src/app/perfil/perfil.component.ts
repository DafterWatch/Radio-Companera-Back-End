import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { Reportero } from '../types';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  id_reportero:string;
  nombres:string;
  apepaterno:string;
  apematerno:string;
  sexo:string;
  cargo:string;
  ci:string;
  validacion:boolean;
  fotoperfil:string;
  serverImagen:string='http://localhost:3000/archivos/';
  private serverDirection :string = 'http://localhost:3000';
  constructor(private http:HttpClient) { 
    
    let usuario:Reportero=JSON.parse(sessionStorage.getItem('usuarioLogeado')).user;
    console.log("usuario: ",usuario);
    this.id_reportero=usuario.id_reportero;
    this.nombres=usuario.nombres;
    this.apepaterno=usuario.apepaterno;
    this.apematerno=usuario.apematerno;
    this.sexo=usuario.sexo;
    this.cargo=usuario.cargo;
    this.ci=usuario.ci;
    this.validacion=false;
    //this.fotoperfil=usuario.fotoperfil;
    this.fotoperfil=this.serverImagen+usuario.fotoperfil;
  }

  ngOnInit(): void {
    
  }
  
  async confirmarPerfil(id:string,urlP:string):Promise<void>{
  
    let exito;
    console.log(id);
    console.log(urlP);
    let nameFoto=urlP.substring(31,urlP.length);
    console.log(nameFoto);
    
    
    
    //await this.http.get(this.serverDirection+`/probe`);
    await this.http.post(this.serverDirection+`/confirmarfoto/${id}/${nameFoto}`,{}).toPromise()
    .then((res:any)=>{exito=res
    });
    if(exito){
      alert("Cuenta deshabilitada");
    }
  }

  async cambiarContrasenia(contraseniaNueva:string): Promise<void> {
    await this.http.post(`http://localhost:3000/cambiarContrasenia/${this.id_reportero}/${contraseniaNueva}`,{}).toPromise().then(resultado=>{});
  }
  validar(contrasenia1:string, contrasenia2:string){
    if(contrasenia1.length>=1){
      if(contrasenia1===contrasenia2){
        this.cambiarContrasenia(contrasenia1);
        alert('¡Exito al cambiar la contraseña!')
      }
      else{
        alert('Las contraseñas no coinciden')
      }
    }
    else{
      alert('Contraseña no valida')
    }
  }

   cargarFotoPerfil(){
    var fotoPerfil:any;
    fotoPerfil=document.getElementById("fotoPerfil");
     fotoPerfil.onchange= async ()=> {
      var archivo=fotoPerfil.files[0];
      const formData:FormData=new FormData();
      formData.append("clientFile",archivo);
      let urlPerfil=this.fotoperfil= await this.http.post(`http://localhost:3000/subirArchivo/`,formData,{responseType:"text"}).toPromise()//.subscribe(resultado=>this.fotoperfil=resultado);
      console.log("URL PEFIL: ",urlPerfil);
      
    };
    fotoPerfil.click();
  }
}
