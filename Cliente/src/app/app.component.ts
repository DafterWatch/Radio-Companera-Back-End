import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { getUserType, Permisos } from './types';
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Radio Compañera - Servidor';
  showLoginScreen : boolean = true;
  serverDirection :string = 'http://localhost:3000';
  id_user : string = '';
  password : string = '';
  permisos : Permisos = {counts:false, settings:false};
  loginDisabled : boolean = false;
  recordarUsuario : boolean = false;

  idFormControl = new FormControl('', [
    Validators.required    
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required    
  ]);

  constructor(private http:HttpClient){
    let data = sessionStorage.getItem('usuarioLogeado');
    console.log(data);
    if(data !== null){
      let jsonData = JSON.parse(data);      
      if(jsonData.remember){
        this.showLoginScreen = false;
      }else{
        sessionStorage.clear();
      }
    }
  }

  async loginIntoPage() : Promise<void>{
    if(this.id_user.length === 0){      
      this.idFormControl.markAllAsTouched();    
      return;
    }
    if (this.password.length ===0) {
      this.passwordFormControl.markAllAsTouched();
      return;
    } 
    this.changeButton('Buscando','0.5',true);    
    let data : getUserType = undefined;    
    await this.http.post(this.serverDirection+`/getUser/${this.id_user}/${this.password}`,{})
      .toPromise()
      .then((res:any) => {
          if(res !== false){
            data = res;
          }
      });    
    if(data){
      this.showLoginScreen=false;
      this.permisos = data.permisos;
      if(this.recordarUsuario){
        //El sessionStorage Tradicional no guardará para todas las pantallas, para corregir esto:
        //https://stackoverflow.com/questions/24382266/sessionstorage-is-not-empty-when-link-opened-in-new-tab-in-internet-explorer
        sessionStorage.setItem('usuarioLogeado', JSON.stringify({user :data.usuario, remember : true}));
      }else{
        sessionStorage.setItem('usuarioLogeado', JSON.stringify({user :data.usuario, remember : false}));
      }    
    }else{      
      this.changeButton('Login','1',false);    
      document.getElementById('error').style.display='block';
    }     
  }
  changeButton(value : string, opacity : string, active : boolean){
    let button : HTMLElement =document.getElementById('btnIngresar');
    button.innerText = value;
    button.style.opacity =opacity;
    this.loginDisabled = active;
  }
}
