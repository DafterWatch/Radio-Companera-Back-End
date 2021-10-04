import { Injectable } from '@angular/core';
import { Reportero, getUserType, Permisos } from '../../types';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  SERVER_DIR : string = 'http://localhost:3000';
  constructor(private http : HttpClient) { }

  private _reportero :Reportero;
  private $reportero : BehaviorSubject<Reportero> = new BehaviorSubject<Reportero>(undefined);
  private _permisos : Permisos;
  
  public getReportero() : Observable<Reportero>{
    return this.$reportero;
  }
  public async setReportero(id_reportero : string, contrasenia : string, recordar : boolean) : Promise<boolean> {
    let data : getUserType = await this.http.post(this.SERVER_DIR+`/getUser/${id_reportero}/${contrasenia}`,{}).toPromise() as getUserType ;
    if(data){
      sessionStorage.setItem('tokenLoged', JSON.stringify({user :data.usuario.id_reportero, remember : recordar}));
      this._reportero = data.usuario;
      this._permisos = data.permisos;
      this.$reportero.next(this._reportero);      
      return true;
    }
    return false;
  }
  public getPermisos() : Permisos{
    return this._permisos;
  }
}
