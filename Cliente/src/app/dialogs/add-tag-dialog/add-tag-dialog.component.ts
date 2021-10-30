import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ReportService } from 'src/app/services/reports/report.service';
import { Categorias } from 'src/app/types';
import { Similarity } from '../../types';

export interface InputCache{
  id_row : string;
  original : HTMLElement;
  new : HTMLInputElement;
}

@Component({
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.scss']
})

export class AddTagDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddTagDialogComponent>,
    public reportService : ReportService
  ) { }
  
  ELEMENT_DATA : Categorias[] = [];
  stack_inputs: InputCache[] = [];

  ngOnInit(): void {
    this.reportService.getCategorias().subscribe(
      (cat : Categorias[]) => {this.ELEMENT_DATA = cat; this.dataSource = this.ELEMENT_DATA}      
    )
  }


  
  closeDialog() : void{
    this.dialogRef.close();
  }
  async addCategory(catName : string) : Promise<void>{
    let status = await this.reportService.createCategoria(catName);
    if(!status){
      alert("Error creando noticia");
    }
  }

  changeToConfirm(row_id : string) : void {
    document.getElementById("confirm-"+row_id).style.display = "block";
    document.getElementById("actions-"+row_id).style.display = "none";
  }
  cancelConfirm(row_id : string){
    document.getElementById("confirm-"+row_id).style.display = "none";
    document.getElementById("actions-"+row_id).style.display = "block";

    if(this.stack_inputs.length > 0){
      /*this.stack_inputs.forEach(
        input => {
          if(input.id_row === row_id){
            const htmlTags = input;
            const tagName = htmlTags.original;
            const inputName = htmlTags.new;

            inputName.parentElement.replaceChild(tagName,inputName);
          }
        }
      )*/
      for (let index = 0; index < this.stack_inputs.length; index++) {
        const input = this.stack_inputs[index];
        if(input.id_row === row_id){
          const htmlTags = input;
          const tagName = htmlTags.original;
          const inputName = htmlTags.new;

          inputName.parentElement.replaceChild(tagName,inputName);
          this.stack_inputs.splice(index, 1);
          break;
        }
      }
    }

  }
  changeToEditName(row_id : string){
    this.changeToConfirm(row_id);
    const tagName : HTMLElement = document.getElementById('sp-'+row_id);
    const inputName : HTMLInputElement = document.createElement('input');
    inputName.type = 'text';
    inputName.value = tagName.innerHTML;    
    inputName.id = 'inputName-'+row_id;
    this.stack_inputs.push({id_row:row_id,original: tagName, new : inputName})
    
    tagName.parentElement.replaceChild(inputName,tagName);
    
  }
  confirmCheck(row_id : string){
    /*if(this.stack_inputs.some(input => input.id_row === row_id)){
      this.modificarCategoria(row_id);
      return;
    }*/
    for (let input of this.stack_inputs) {
      //const input = this.stack_inputs[index];
      if(input.id_row === row_id){
        this.modificarCategoria(row_id,input);
        return;
      }
    }
    this.eliminarCategoria(row_id);
  }
  modificarCategoria(row_id : string, htmlTags : any){
    let newName = htmlTags.new.value;    
    let oldName = htmlTags.original.innerHTML;    
    console.log(Similarity.similarity(newName,oldName));
    if(Similarity.similarity(newName,oldName) > 0.55){      
      alert("Las categorias son muy similares. Por favor escoja otro nombre");
      this.cancelConfirm(row_id);
      return;
    }
    alert("Las categorias no son muy similares");
    //this.reportService.updateCategory(row_id,newName);
    this.cancelConfirm(row_id);
  }

  eliminarCategoria(row_id : string){
    this.reportService.deleteCategory(row_id);
    this.cancelConfirm(row_id);
  }
  

  displayedColumns: string[] = ['ID', 'nombre','Acciones'];
  dataSource = this.ELEMENT_DATA;
}
