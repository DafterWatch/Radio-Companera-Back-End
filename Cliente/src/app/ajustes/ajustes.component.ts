import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportService } from 'src/app/services/reports/report.service';
import { Configuracion } from '../types' ;

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss']
})
export class AjustesComponent implements OnInit {

  configuracion:Configuracion[];
  constructor(private http:HttpClient, private reportService : ReportService) { 
    this.getConfiguracion();
  }

  ngOnInit(): void {
  }

  async getConfiguracion(): Promise<void>{
    await this.reportService.getConfiguracion().then((data:Configuracion[])=>{
      this.configuracion=data;

      /*console.log(this.configuracion[0].titulo);
      console.log(this.configuracion[0].banner);*/
    })
  }
  borrarBanner():void{
    this.configuracion[0].banner='';
  }
  cargarBanner():void{
    var fotoBanner:any;
    fotoBanner=document.getElementById("fotoBanner");
    fotoBanner.onchange= async ()=> {
    var archivo=fotoBanner.files[0];
    const formData:FormData=new FormData();
    formData.append("clientFile",archivo);
    this.configuracion[0].titulo= await this.http.post(`http://localhost:3000/subirArchivo/`,formData,{responseType:"text"}).toPromise();
    };
  }
  async updateConfiguracion(titulo:string): Promise<void>{
    await this.reportService.updateConfiguracion(titulo,this.configuracion[0].banner).then((res:any[])=>{})
  }
}
