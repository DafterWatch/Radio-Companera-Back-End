import { InforeportEditComponent } from './../../dialogs/inforeport-edit/inforeport-edit.component';
import { Component, OnInit,Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AddTagDialogComponent } from 'src/app/dialogs/add-tag-dialog/add-tag-dialog.component';
import { FileExplorerMiniComponent } from '../file-explorer-mini/file-explorer-mini.component';
import { Notice,Notice_Content, Reportero } from '../../types';
import { UserService } from 'src/app/services/userService/user.service';
import { ReportService } from 'src/app/services/reports/report.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-edit-entrada',
  templateUrl: './edit-entrada.component.html',
  styleUrls: ['./edit-entrada.component.scss']
})
export class EditEntradaComponent implements OnInit {

  @Input() idNoticia:any='4';

  constructor(private dialog:MatDialog, private userService : UserService, private reportService : ReportService, private snackBar: MatSnackBar) { 
    this.userService.getReportero().subscribe((_reportero : Reportero)=> this.currentReporter = _reportero);
    this.reportService.getCategorias().then((cat:string[])=> this.categorias = cat);
    this.recuperarReport();
  }

  categorias : string[];
  categoriasNoticia : string[];
  htmlContent : string='';
  coverImage : string = '';
  tagsModel : string ='';
  titleModel : string = '';
  currentReporter : Reportero; 
  idReportEncargado:string;


  ngOnInit(): void {
  }

  async recuperarReport(){
    let notice=await this.reportService.getReport(this.idNoticia);
    
    console.log("servicio");
    console.log(notice[0]);

    this.titleModel=notice[0].titulo;
    this.htmlContent=notice[0].contenido;
    this.coverImage=notice[0].imagen;
    this.recuperarCategorias();
    this.idReportEncargado=notice[0].id_reportero;
    
  }

  async recuperarCategorias(){
 
    //await this.reportService.getCategorias().then((cat:string[])=> this.categoriasNoticia = cat);
    await this.reportService.getCategoriasNotice(this.idNoticia).then((cat:string[])=> this.categoriasNoticia = cat);
  
    
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
    
    categories = categories.map(cat => `'${cat.value}'`);
    const unicos = categories.filter((valor, indice) => {
        return categories.indexOf(valor) === indice;
      }
    );

    console.log(unicos);
    
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

    //MODIFICAR noticia -REVISAR
    let state : string = await this.reportService.updateReport(this.idNoticia, this.currentReporter.id_reportero);
if(state){
  let notice_content : Notice_Content = {
    id_noticia:this.idNoticia,
    imagen_portada : this.coverImage,
    titulo : this.titleModel,
    contenido : this.htmlContent,
    etiquetas : this.tagsModel===''?null: this.tagsModel.split(',')
  }

  let status : boolean = await this.reportService.updateReportContent(this.idNoticia,notice_content,unicos);
  if(status){
    this.snackBar.open("¡Noticia modificada!","Ok");
    //redirigir a historial de medios
  }else{
    this.snackBar.open("¡Problema modificando la noticia, verifique los campos y vuelva a intentar!","Ok");
  }
}
else{
  this.snackBar.open("¡Problema modificando la noticia, verifique los campos y vuelva a intentar!","Ok");
}
  }

  async deleteReport(): Promise<void>{
    let state =await this.reportService.deshabilitarNotice(this.idNoticia);
if(state){this.snackBar.open("Noticia deshabilitada","Ok");}
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
    const dialogRef = this.dialog.open(AddTagDialogComponent);
    dialogRef.afterClosed().subscribe(newCategory =>{
      this.categorias.push(newCategory);
    });
  }
  agregarEtiquetas(){        
    if(this.tagsModel === ''){
      this.snackBar.open("Debe de agregar etiquetas","Ok");
      return;
    }
    
  }

  openInfoReport(){
    const dialogRes=this.dialog.open(InforeportEditComponent,{data:this.idNoticia});
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
  openSnackBar(messaje:string) {
    this.snackBar.open(messaje, 'Listo!', {
      horizontalPosition:'center',
      verticalPosition: 'top',
    });
  }
  eliminarNotice(){
    this.openSnackBar("Noticia: "+this.idNoticia+ " eliminada/deshabilitada");
  }
}


