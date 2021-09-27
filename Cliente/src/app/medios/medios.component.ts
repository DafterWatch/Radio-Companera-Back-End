import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { FileElement } from '../file-explorer/model/file-element';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-medios',
  templateUrl: './medios.component.html',
  styleUrls: ['./medios.component.scss']  ,
  providers:[FileService]
})

export class MediosComponent implements OnInit {

  constructor(public fileService: FileService, public http:HttpClient) { 
    
  }
  SERVER_DIR : string = 'http://localhost:3000';

  fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp:boolean = false;

  ngOnInit(): void {
    /*const folderA = this.fileService.add({ name: 'Carpeta A', isFolder: true, parent: 'root' });
    this.fileService.add({ name: 'Carpeta B', isFolder: true, parent: 'root' });
    this.fileService.add({ name: 'Carpeta C', isFolder: true, parent: folderA.id });
    this.fileService.add({ name: 'Archivo A', isFolder: false, parent: 'root' });
    this.fileService.add({ name: 'Archivo B', isFolder: false, parent: 'root' });*/    
    this.loadFolders();    
  }
  async loadFolders() {
    //Hará el esquema persistente, para quitar comentar esto y la línea 25 en services / file.service.ts    
    await this.fileService.readSchema();
    this.updateFileElementQuery();
  }
  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.updateFileElementQuery();
  }
  
  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }
  
  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }
  
  renameElement(element: FileElement) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }
  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }
  
  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }
  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }
  
  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }
  addFile(file:any){
    const [typeFile, format]:[string,string] = file.type.split('/');
    const fileName : string = (file.name.length>10)?file.name.substring(0,10)+'...'+format:file.name;
    if(['audio','video','image'].includes(typeFile)){
      const formData : FormData = new FormData();
      formData.append('clientFile',file);
      this.http.post(this.SERVER_DIR+'/subirArchivo',formData,{responseType:'text'})
        .subscribe((fileUrl : string)=>{
          this.fileService.add({
            isFolder:false,
            name:fileName,
            parent: this.currentRoot ? this.currentRoot.id : 'root',       
            completeName:file.name,
            type:typeFile,
            fechaCreacion:new Date,
            source: typeFile !== 'image'? undefined:fileUrl,
            format:format,
            audioVideoSrc:typeFile === 'image'? undefined:fileUrl,
          });
          this.updateFileElementQuery();   
        });
    }else{
      alert('No se selecciono un tipo de archivo valido');
    }
  }
}
