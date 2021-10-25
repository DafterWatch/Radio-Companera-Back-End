import { PublicidadContent } from 'src/app/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicidadService {
  SERVER_DIR : string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  public async createPublicidad(publiContent : PublicidadContent) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+'/cargarPublicidad',{ContenidoPublicidad: publiContent}).toPromise();
    return queryStatus;
  }
  public async getPublicidad(idPublicidad :string):Promise<any>{
    let publi=null;
    publi=await this.http.post(this.SERVER_DIR+`/getPublicidadEdit/${idPublicidad}`,{}).toPromise();
    return publi;
  }
  public async updatePublicidad(idPublicidad:string,publiContent : PublicidadContent) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+`/updatePublicidad/${idPublicidad}`,{ContenidoPublicidad: publiContent}).toPromise();
    return queryStatus;
  }
}
