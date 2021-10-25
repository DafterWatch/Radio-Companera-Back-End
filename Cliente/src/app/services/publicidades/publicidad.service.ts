import { Publicidad } from './../../types';
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
  async getPublcidadHabiles():Promise<any>{
    let publicidad: Publicidad[] = await this.http.get<Publicidad[]>(`http://localhost:3000/getPublcidadHabiles`,{}).toPromise();
    return publicidad.length;
  }
  async getPubliOld():Promise<Publicidad[]>{
    let publicidad: Publicidad[] = await this.http.get<Publicidad[]>(`http://localhost:3000/getPubliOld`,{}).toPromise();
    return publicidad;
  }
  public async desHabilitarPubli(idPublicidad:string) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+`/desHabilitarPubli/${idPublicidad}`,{}).toPromise();
    return queryStatus;
  }
  
  
}
