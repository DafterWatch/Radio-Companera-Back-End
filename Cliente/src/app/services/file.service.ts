import { Injectable } from '@angular/core';
import { v4 } from 'uuid';
import { FileElement } from '../file-explorer/model/file-element';
import { BehaviorSubject } from 'rxjs';
import { Observable,throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export interface IFileService {
  add(fileElement: FileElement);
  delete(id: string);
  update(id: string, update: Partial<FileElement>);
  queryInFolder(folderId: string): Observable<FileElement[]>;
  get(id: string): FileElement;
}

@Injectable()
export class FileService implements IFileService {
  public map = new Map<string, FileElement>();

  constructor(private http:HttpClient) {}

  add(fileElement: FileElement) {
    fileElement.id = v4();
    this.map.set(fileElement.id, this.clone(fileElement));     
    this.saveSchema();
    return fileElement;
  }

  delete(id: string) {
    this.map.delete(id);
    this.saveSchema();
  }

  update(id: string, update: Partial<FileElement>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);    
    if(!element.isFolder){
      element.completeName = update.name;
      console.log(update);      
    }
    this.map.set(element.id, element);    
    this.saveSchema();
  }

  private querySubject: BehaviorSubject<FileElement[]>
  queryInFolder(folderId: string) {
    const result: FileElement[] = []
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    })
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element));
  }
  saveSchema(){            
    this.http.post('http://localhost:3000/saveSchema',{schema: JSON.stringify(Array.from(this.map.entries()))})
    .pipe(catchError(this.errorHandler))
    .subscribe();
  }
  async readSchema(){    
    await this.http.get('http://localhost:3000/getSchema',{responseType:'text'})
    .pipe(catchError(this.errorHandler))
    .toPromise().then(res=>{
      if(res!==''){                
        this.map = new Map(JSON.parse(res));        
      }
    });    
  }
  private errorHandler(errorResponse:HttpErrorResponse){
    if(errorResponse.error instanceof ErrorEvent){
      console.log("Error del lado del cliente: "+errorResponse.error.message);      
    } else{
      console.log("Error del servidor: ", errorResponse)
    }

    return throwError("Error en el servidor");
  }
}
