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
  hide : boolean = true;

  idFormControl = new FormControl('', [
    Validators.required    
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required    
  ]);

  constructor(private reporteroService : UserService){
    let data = sessionStorage.getItem('tokenUser');
    if(data){
      const rememberedUser : any = JSON.parse(data);
      this.showLoginScreen = false;
      this.reporteroService.setReportero(rememberedUser.user,rememberedUser.password);
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
    let login_succes = await this.reporteroService.setReportero(this.id_user,this.password);  
    if(login_succes){
      if(this.recordarUsuario){
        sessionStorage.setItem("tokenUser", JSON.stringify({user : this.id_user, password: this.password}) )
        //hay que cifrar el password !!!
      }
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
  closeSession(){
    this.showLoginScreen = true;
    this.id_user = "";
    this.password = "";
    this.idFormControl.markAsUntouched();
    this.passwordFormControl.markAsUntouched();
    sessionStorage.removeItem("tokenUser");
    setTimeout(()=> this.changeButton("Login","1",false), 2000);    
  }
}
