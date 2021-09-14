import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { getUserType, Permisos } from './types';

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
  constructor(private http:HttpClient){}

  async loginIntoPage() : Promise<void>{
    
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
      localStorage.setItem('usuarioLogeado', JSON.stringify(data.usuario));
    }else{      
      //Desplegar mensaje de error
      alert('Error credenciales incorrectas');
    }    
  }
}
