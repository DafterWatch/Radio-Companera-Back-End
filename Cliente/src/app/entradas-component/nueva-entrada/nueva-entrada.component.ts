import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AddTagDialogComponent } from 'src/app/dialogs/add-tag-dialog/add-tag-dialog.component';
import { FileExplorerMiniComponent } from '../file-explorer-mini/file-explorer-mini.component';
import { Categorias, Notice,Notice_Content, Reportero } from '../../types';
import { UserService } from 'src/app/services/userService/user.service';
import { ReportService } from 'src/app/services/reports/report.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nueva-entrada',
  templateUrl: './nueva-entrada.component.html',
  styleUrls: ['./nueva-entrada.component.scss']
})
export class NuevaEntradaComponent implements OnInit {

  constructor(private dialog:MatDialog,
              private userService : UserService,
              private reportService : ReportService,
              private snackBar: MatSnackBar,
              private router : Router) { 
    this.userService.getReportero().subscribe((_reportero : Reportero)=> this.currentReporter = _reportero);
    this.categorias = this.reportService.getCategorias();
  }
  //categorias : string[];
  categorias : Observable<Categorias[]>;
  htmlContent : string='';
  coverImage : string = '';
  tagsModel : string ='';
  titleModel : string = '';
  currentReporter : Reportero;  
  ngOnInit(): void {
    if(sessionStorage.getItem("tokenUser"))
      this.router.navigate(['']);
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '35rem',
    minHeight: '5rem',
    placeholder: 'Ingrese el texto acá',
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['insertImage',
      'insertVideo',
      'link',
      'unlink',]
    ]
  }
  async publicarNoticia(categories : any) : Promise<void>{
    
    if(categories.length === 0){
      this.snackBar.open('Por favor seleccione una o más categorias',"OK");
      return;
    }

    if(this.coverImage === ''){
      this.snackBar.open('Por favor seleccione una foto de portada',"OK");
      return;
    }
    if(this.titleModel === ''){
      this.snackBar.open('Debe especificar el título',"OK");
      return;
    }
    if(this.htmlContent===''){
      this.snackBar.open('Debe agregar contenido para la noticia',"OK");
      return;
    }
    if(this.titleModel.length > 150){
      this.snackBar.open("El título puede tener como máximo 150 carácteres");
      return;
    }
    let notice : Notice = {
      id_reportero : this.currentReporter.id_reportero,
      ultima_modificacion : null,
      fecha : new Date,
      estado : true
    }
    //publicamos noticia
    let id_noticia_str : string = await this.reportService.createReport(notice);
    let id_noticia : number = parseInt(id_noticia_str);
    if(!id_noticia){       
      this.snackBar.open("¡Problema creando la noticia!","Ok");
      return;
    }
    let notice_content : Notice_Content = {
      id_noticia,
      imagen_portada : this.coverImage,
      titulo : this.titleModel,
      contenido : this.htmlContent,
      etiquetas : this.tagsModel===''?null: this.tagsModel.split(',')
    }
    categories = categories.map(cat => `'${cat.value}'`);
    let status : boolean = await this.reportService.createReportContent(notice_content,categories);
    if(status){
      this.snackBar.open("¡Noticia creada!","Ok");
      this.router.navigate(['/entradas']);
      //redirigir a historial de medios
    }else{
      this.snackBar.open("¡Problema creando la noticia, verifique los campos y vuelva a intentar!","Ok");
    }
  }

  seleccionarPortada(){
    const dialogsRef = this.dialog.open(FileExplorerMiniComponent);
    dialogsRef.afterClosed().subscribe( mediaData =>{
      if(mediaData.type === 'image'){
        this.coverImage = mediaData.src;
        return;
      }            
      this.snackBar.open("Seleccione un tipo de medio valido","¡Entiendo!");
    });
  }
  agregarCategoria(){
    const dialogRef = this.dialog.open(AddTagDialogComponent, {
      panelClass: "custom-dialog-container"
    });
    dialogRef.afterClosed().subscribe(newCategory =>{
      if(newCategory && newCategory.length > 0)
        this.categorias = this.reportService.getCategorias();
    });
  }
  agregarEtiquetas(){        
    if(this.tagsModel === ''){
      this.snackBar.open("Debe de agregar etiquetas","Ok");
      return;
    }
    
  }

  agregarMedio() : void{
    const dialogsRef = this.dialog.open(FileExplorerMiniComponent);
    dialogsRef.afterClosed().subscribe(mediaData =>{      
      switch (mediaData.type) {
        case 'video':
          this.htmlContent += `
          <video controls width="300" height="320">
          <source src="${mediaData.src}">
          </video>
          <br/>
          `          
          break;
        case 'image':
          this.htmlContent += `<img src='${mediaData.src}' />`;     
          break;
        case 'audio':
          this.htmlContent += `
          <audio controls>
          <source src="${mediaData.src}">
          </audio>
          <br/>
          `
          break;
        default:
          break;
      }
    });
  }  
}
