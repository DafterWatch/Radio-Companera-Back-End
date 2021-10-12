import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notice,Notice_Content, Entradas } from '../../types' ;

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private 


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

  public async getReport(idNoticia :string):Promise<any>{
    let notice=null;
    //await this.http.get(this.serverDirection+`/probe`);
    notice=await this.http.post(this.SERVER_DIR+`/getReportComplet/${idNoticia}`,{}).toPromise();
    /*.then((res:any)=>{notice=res.rows
      console.log(notice);
      return notice;
    });*/
    console.log(notice);
    return notice;
  }

  public async getCategoriasNotice(idNoticia:string):Promise<string[]>{
    let categoriasSeleccionadas:string[];

    categoriasSeleccionadas= await this.http.get<string[]>(this.SERVER_DIR+`/getCategoriaNotice/${idNoticia}`,{}).toPromise();
    return categoriasSeleccionadas;

  }
  
  public async updateReport(idNoticia:string,idReportModif:string) : Promise<any>{
    let state = await this.http.post(this.SERVER_DIR + `/updateNoticia/${idNoticia}/${idReportModif}`,{}).toPromise();
    return state;
  }
  public async updateReportContent(idNotice:string,reportContent : Notice_Content, categorias : string[]) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+`/updateContenidoNoticia/${idNotice}`,{ContenidoNoticia: reportContent, categorias}).toPromise();
    return queryStatus;
  }
  public async deshabilitarNotice(idNoticia:string) : Promise<any>{
    let state = await this.http.post(this.SERVER_DIR + `/deshabilitarNotice/${idNoticia}`,{}).toPromise();
    return state;
  }
  
}
