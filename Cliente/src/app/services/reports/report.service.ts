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
    let id_noticia = await this.http.post<string>(this.SERVER_DIR + '/crearNoticia', report).toPromise();
    return id_noticia;
  }
  public async createReportContent(reportContent : Notice_Content, categorias : string[]) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+'/cargarContenidoNoticia',{ContenidoNoticia: reportContent, categorias}).toPromise();
    return queryStatus;
  }
  public async getCategorias() : Promise<string[]> {
    let categories : string[] = await this.http.get<string[]>(this.SERVER_DIR+'/getCategorias').toPromise();
    return categories;
  }
  public async createCategoria(catName :string) : Promise<boolean>{
    let status : boolean = await this.http.post<boolean>(this.SERVER_DIR+'/createCategory',{category : catName}).toPromise();
    return status;
  }
}
