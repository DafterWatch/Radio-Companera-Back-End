import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notice,Notice_Content, Entradas, Publicidad, Configuracion, Categorias } from '../../types' ;
import {map} from 'rxjs/operators';
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
  public async deleteCategory(id_categoria : string) : Promise<boolean> {
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+"/cambiarCategoria",{id_categoria,eliminar : true}).toPromise();
    return queryStatus;
  }
  public async updateCategory(id_categoria : string, nuevo_valor : string) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+"/cambiarCategoria",{id_categoria,eliminar:false,nuevo_valor}).toPromise();
    return queryStatus;
  }

  public async createReportContent(reportContent : Notice_Content, categorias : string[]) : Promise<boolean>{
    let queryStatus = await this.http.post<boolean>(this.SERVER_DIR+'/cargarContenidoNoticia',{ContenidoNoticia: reportContent, categorias}).toPromise();
    return queryStatus;
  }
  public getCategorias() : Observable<Categorias[]> {
    let categories : Observable<Categorias[]> = this.http.get<Categorias[]>(this.SERVER_DIR+'/getCategorias').pipe(
      map(cat => cat.filter(item => item.estado ))
    );
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
    //console.log(notice);
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

  async getEntradas():Promise<Entradas[]>{
    let entradas: Entradas[] = await this.http.get<Entradas[]>(`http://localhost:3000/getEntradas`,{}).toPromise();
    return entradas;
  }
  async getBuscarEntradas(tituloNoticia:string): Promise<Entradas[]> {
    let entradas: Entradas[] = await this.http.get<Entradas[]>(`http://localhost:3000/getBuscarEntradas/${tituloNoticia}`,{}).toPromise();
    return entradas;
  }
  async getFiltarEntradasFecha(fecha:string): Promise<Entradas[]> {
    let entradas: Entradas[] = await this.http.get<Entradas[]>(`http://localhost:3000/getFiltarEntradasFecha/${fecha}`,{}).toPromise();
    return entradas;
  }
  async getFiltarEntradasCategoria(categoria:string): Promise<Entradas[]> {
    let entradas: Entradas[] = await this.http.get<Entradas[]>(`http://localhost:3000/getFiltarEntradasCategoria/${categoria}`,{}).toPromise();
    return entradas;
  }

  async getEntradasPublicidad():Promise<Publicidad[]>{
    let publicidad: Publicidad[] = await this.http.get<Publicidad[]>(`http://localhost:3000/getEntradasPublicidad`,{}).toPromise();
    return publicidad;
  }
  async getEntradasPublicidadTitulo(titulo:string):Promise<Publicidad[]>{
    let publicidad: Publicidad[] = await this.http.get<Publicidad[]>(`http://localhost:3000/getEntradasPublicidadTitulo/${titulo}`,{}).toPromise();
    return publicidad;
  }
  async getEntradasPublicidadEmpresa(empresa:string):Promise<Publicidad[]>{
    let publicidad: Publicidad[] = await this.http.get<Publicidad[]>(`http://localhost:3000/getEntradasPublicidadEmpresa/${empresa}`,{}).toPromise();
    return publicidad;
  }
  async getEntradasPublicidadFecha(fecha:string):Promise<Publicidad[]>{
    let publicidad: Publicidad[] = await this.http.get<Publicidad[]>(`http://localhost:3000/getEntradasPublicidadFecha/${fecha}`,{}).toPromise();
    return publicidad;
  }

  async getConfiguracion():Promise<Configuracion[]>{
    let configuracion: Configuracion[] = await this.http.get<Configuracion[]>(`http://localhost:3000/getConfiguracion`,{}).toPromise();
    return configuracion;
  }
  public async updateConfiguracion(confContenido:Configuracion) : Promise<boolean>{
    let state = await this.http.post<boolean>(this.SERVER_DIR+`/updateConfiguracion`,{config: confContenido}).toPromise();
    return state;
  }
}
