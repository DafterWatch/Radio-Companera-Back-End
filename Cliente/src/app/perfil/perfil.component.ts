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
  constructor(private http:HttpClient) { 
    let usuario:Reportero=JSON.parse(sessionStorage.getItem('usuarioLogeado')).user;
    this.id_reportero=usuario.id_reportero;
    this.nombres=usuario.nombres;
    this.apepaterno=usuario.apepaterno;
    this.apematerno=usuario.apematerno;
    this.sexo=usuario.sexo;
    this.cargo=usuario.cargo;
    this.ci=usuario.ci;
    this.validacion=false;
  }

  ngOnInit(): void {
    
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
}
