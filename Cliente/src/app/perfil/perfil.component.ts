import { ChangepassComponent } from './../dialogs/changepass/changepass.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService/user.service';
import { DisableAccountComponent } from '../dialogs/disable-account/disable-account.component';
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
  constructor(private http:HttpClient, private reporteroService : UserService,public dialog:MatDialog) { 
    
    //let usuario:Reportero=JSON.parse(sessionStorage.getItem('usuarioLogeado')).user;
    reporteroService.getReportero().subscribe((_reportero : Reportero)=>{
      if(!_reportero) return;
        this.id_reportero=_reportero.id_reportero;
        this.nombres=_reportero.nombres;
        this.apepaterno=_reportero.apepaterno;
        this.apematerno=_reportero.apematerno;      
        this.sexo = _reportero.sexo==="M"?"Masculino":"Femenino";
        this.cargo=_reportero.cargo.toUpperCase();
        this.ci=_reportero.ci;
        this.validacion=false;      
        this.fotoperfil=this.serverImagen+_reportero.fotoperfil;
      });
  }

  ngOnInit(): void {
    
  }
  
  async confirmarPerfil(id:string,urlP:string):Promise<void>{
  
    let exito;
    console.log(id);
    console.log(urlP);
    let nameFoto=urlP.substring(31,urlP.length);
    console.log(nameFoto);

    await this.http.post(this.serverDirection+`/confirmarfoto/${id}/${nameFoto}`,{}).toPromise()
    .then((res:any)=>{exito=res
    });
    if(exito){
      alert("Foto de perfil guardada");
      document.getElementById("btnConfirmarFoto").style. display= "none";
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
      
    };
    fotoPerfil.click();
    document.getElementById("btnConfirmarFoto").style. display= "flex";
    document.getElementById("btnConfirmarFoto").style.justifyContent="center";
    document.getElementById("btnConfirmarFoto").style.position="relative";
  }

  mostraropc(){
    console.log("entra");
    console.log(document.getElementById("opciones").style.display);
    
    if(document.getElementById("opciones").style.display=="inline"){
      document.getElementById("opciones").style.display="none";
    }else{
      document.getElementById("opciones").style.display="inline";
    }
    
  }

  mostrarFormpass(){
      const dialogRes=this.dialog.open(ChangepassComponent)
      //dialogRes.afterClosed().subscribe(data=>)
  }
}
