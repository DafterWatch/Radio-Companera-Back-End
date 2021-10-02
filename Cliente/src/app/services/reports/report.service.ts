import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notice,Notice_Content } from '../../types' ;
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  SERVER_DIR : string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  public async createReport(report : Notice) : Promise<string>{
    let id_noticia = await this.http.post(this.SERVER_DIR + '/crearNoticia', report).toPromise() as string;
    return id_noticia;
  }
  public async createReportContent(reportContent : Notice_Content, categorias : string[]) : Promise<boolean>{
    let queryStatus = await this.http.post(this.SERVER_DIR+'/cargarContenidoNoticia',{ContenidoNoticia: reportContent, categorias}).toPromise() as boolean;
    return queryStatus;
  }
}
