import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AddTagDialogComponent } from 'src/app/dialogs/add-tag-dialog/add-tag-dialog.component';
import { FileExplorerMiniComponent } from '../file-explorer-mini/file-explorer-mini.component';
import { Notice,Notice_Content, Reportero } from '../../types';
import { UserService } from 'src/app/services/userService/user.service';
import { ReportService } from 'src/app/services/reports/report.service';
import { MatListOption } from '@angular/material/list';
@Component({
  selector: 'app-nueva-entrada',
  templateUrl: './nueva-entrada.component.html',
  styleUrls: ['./nueva-entrada.component.scss']
})
export class NuevaEntradaComponent implements OnInit {

  constructor(private dialog:MatDialog, private userService : UserService, private reportService : ReportService) { 
    
  }
  categorias : string[] = ['Ciencia y tecnología', 'Deportes','Economía','Internacional','Política','Seguridad','Social','Moda'];
  htmlContent : string='';
  coverImage : string = '';
  tagsModel : string ='';
  titleModel : string = '';
  currentReporter : Reportero;
  ngOnInit(): void {
    
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
     this.currentReporter = this.userService.getReportero();
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
       alert('Problema creando la noticia');
       return;
     }
     let notice_content : Notice_Content = {
       id_noticia,
       imagen_portada : this.coverImage,
       titulo : this.titleModel,
       contenido : this.htmlContent,
       etiquetas : this.tagsModel.split(',')
     }
    categories = categories.map(cat => `'${cat.value}'`);
    let status : boolean = await this.reportService.createReportContent(notice_content,categories);
    if(status){

    }else{

    }
  }

  seleccionarPortada(){
    const dialogsRef = this.dialog.open(FileExplorerMiniComponent);
    dialogsRef.afterClosed().subscribe( mediaData =>{
      if(mediaData.type === 'image'){
        this.coverImage = mediaData.src;
        return;
      }
      //Usar mensaje emergente
      alert('Seleccione un tipo de medio válido para la portada de la noticia');
    });
  }
  agregarCategoria(){
    const dialogRef = this.dialog.open(AddTagDialogComponent);
    dialogRef.afterClosed().subscribe(newCategory =>{
      this.categorias.push(newCategory);
    });
  }
  agregarEtiquetas(){
    console.log(this.tagsModel);
    
    if(this.tagsModel === ''){
      alert('Debe agregar etiquetas');
      return;
    }
    
  }

  agregarMedio() : void{
    const dialogsRef = this.dialog.open(FileExplorerMiniComponent);
    dialogsRef.afterClosed().subscribe(mediaData =>{
      //
      
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
