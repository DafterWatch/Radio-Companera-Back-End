import { ReportService } from 'src/app/services/reports/report.service';
import { Component, VERSION,OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

interface Ventana {
  id: number
  nombre: string
  seleccionado: boolean  
}

const mockData = of([
  { nombre: 'ventana 10', id: 1 },
  { nombre: 'ventana 2', id: 4 },
  { nombre: 'ventana 3', id: 3 },
  { nombre: 'ventana 11', id: 11 },
]);

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss']
})
export class PruebaComponent implements OnInit {

  public modulos = new FormControl();

  // Datos que provienen de la DB
  public ventanas;

  // lista de ids de permisos
  public listMod = [1,2,3,8,11];

  categorias : string[];
  categoriasNoticia : string[];
  constructor(public fb: FormBuilder,private reportService:ReportService) {

    this.reportService.getCategorias().then((cat:string[])=> this.categorias = cat);
    this.recuperarCategorias();
    
    // Simulacion de requests a la BD
    mockData.subscribe((result) => {

      this.ventanas = result.map((item) => ({
        ...item,
        seleccionado: this.listMod.some((el) => 
          el === item.id
        )
      }));

    });

    //
    
  }

  verCategorias(categories : any){
    console.log(categories);

  }

  async recuperarCategorias(){
    //await this.reportService.getCategorias().then((cat:string[])=> this.categoriasNoticia = cat);
    await this.reportService.getCategoriasNotice('4').then((cat:string[])=> this.categoriasNoticia = cat);
    
      console.log ("Categoria de noticia  :" + this.categoriasNoticia);

  }

  ngOnInit(): void {
  }

  
}
