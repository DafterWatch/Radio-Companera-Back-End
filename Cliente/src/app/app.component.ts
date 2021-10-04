import { Component } from '@angular/core';
import { getUserType, Permisos } from './types';
import {FormControl, Validators} from '@angular/forms';
import { UserService } from './services/userService/user.service';

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

  constructor(private reporteroService : UserService){
    let data = sessionStorage.getItem('tokenLoged');    
    if(data !== null){
      let jsonData = JSON.parse(data);      
      if(jsonData.remember){
        //TODO: Ahora en el session no se guardará todo el usuario
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
    let login_succes = await this.reporteroService.setReportero(this.id_user,this.password, this.recordarUsuario);  
    if(login_succes){
      this.showLoginScreen=false;
      this.permisos = this.reporteroService.getPermisos();              
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
