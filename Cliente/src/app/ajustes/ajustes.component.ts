import { MatSnackBar } from '@angular/material/snack-bar';
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
  titulo;
  banner;
  constructor(private snackBar:MatSnackBar,private http:HttpClient, private reportService : ReportService) { 
    this.getConfiguracion();
  }

  ngOnInit(): void {
  }

  async getConfiguracion(): Promise<void>{
    await this.reportService.getConfiguracion().then((data:Configuracion[])=>{
      this.configuracion=data;
      this.titulo=this.configuracion[0].titulo;
      this.banner=this.configuracion[0].banner;

      /*console.log(this.configuracion[0].titulo);
      console.log(this.configuracion[0].banner);*/
    })
  }
  borrarBanner():void{
    this.banner='http://localhost:3000/archivos/1635218871553bannerPorDefecto.png';
  }
  cargarBanner():void{
    var fotoBanner:any;
    fotoBanner=document.getElementById("fotoBanner");
    fotoBanner.onchange= async ()=> {
    var archivo=fotoBanner.files[0];
    const formData:FormData=new FormData();
    formData.append("clientFile",archivo);
    const [typeFile, format]:[string,string] = archivo.type.split('/');
    if(['image'].includes(typeFile)){
      this.banner= await this.http.post(`http://localhost:3000/subirArchivo/`,formData,{responseType:"text"}).toPromise();
    }else{
      this.snackBar.open("Seleccione una imagen valida para el banner","Ok");
    }
    
    };
    fotoBanner.click();
  }
  async updateConfiguracion(): Promise<void>{
    //console.log(titulo+" "+this.configuracion[0].banner)
    let confContenido:Configuracion={
      titulo:this.titulo, banner:this.banner
    }
    let status=await this.reportService.updateConfiguracion(confContenido);
    if(status){
      this.snackBar.open("Cambios guardados exitosamente","Ok");
    }else{
      this.snackBar.open("Error al actualizar información","Ok");
    }
  }
}
