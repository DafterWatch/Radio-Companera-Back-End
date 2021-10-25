import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class comunicacionComponentesService {

  SERVER_DIR : string = 'http://localhost:3000';
  constructor(private http : HttpClient) { }

  private idEntrada:string="";
  private idPublicidad:string="";
  public getIDEntrada():string{
    return this.idEntrada;
  }
  public setIDEntrada(id:string):void{
    this.idEntrada=id;
  }
  public getIDPublicidad():string{
    return this.idEntrada;
  }
  public SetIDPublicidad(id:string):void{
    this.idEntrada=id;
  }
}
