import { Injectable } from '@angular/core';
import { Reportero, getUserType, Permisos } from '../../types';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

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



  public async setReportero(id_reportero : string, contrasenia : string) : Promise<boolean> {
    let data : getUserType = await this.http.post<getUserType>(this.SERVER_DIR+`/getUser/${id_reportero}/${contrasenia}`,{})
    .pipe(
      catchError(this.errorHandler)
    ).toPromise();
    if(data){      
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
  public closeSession() : void{
    this._permisos = null;
    this.$reportero.next(null);
  }
  private errorHandler(errorResponse : HttpErrorResponse) {
    if(errorResponse.error instanceof ErrorEvent){
      console.log("Error del lado del cliente: "+errorResponse.error.message);      
    } else{
      console.log("Error del servidor: ", errorResponse)
    }

    return throwError("Error en el servidor");
  }
  public async getUserCreado(idReportero :string):Promise<any>{
    let datosCreados=null;
    //await this.http.get(this.serverDirection+`/probe`);
    datosCreados=await this.http.post(this.SERVER_DIR+`/getUserByCI/${idReportero}`,{}).toPromise();
    /*.then((res:any)=>{notice=res.rows
      console.log(notice);
      return notice;
    });*/
    //console.log(notice);
    return datosCreados;
  }

  public async getUsers():Promise<any>{
    let cuentas=null;
    //await this.http.get(this.serverDirection+`/probe`);
    cuentas=await this.http.post(this.SERVER_DIR+`/probe/`,{}).toPromise();
    /*.then((res:any)=>{notice=res.rows
      console.log(notice);
      return notice;
    });*/
    //console.log(notice);
    return cuentas;
  }
  public async probefilter( idnom:string):Promise<any>{
    let cuentas=null;
    //await this.http.get(this.serverDirection+`/probe`);
    cuentas=await this.http.post(this.SERVER_DIR+`/probefilter/${idnom}`,{}).toPromise();
    /*.then((res:any)=>{notice=res.rows
      console.log(notice);
      return notice;
    });*/
    //console.log(notice);
    return cuentas;
  }
}
