import { ReportService } from 'src/app/services/reports/report.service';
import { MatPaginator } from '@angular/material/paginator';
import { ChangepassComponent } from './../dialogs/changepass/changepass.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '../services/userService/user.service';
import { DisableAccountComponent } from '../dialogs/disable-account/disable-account.component';
import { Reportero } from '../types';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  dataSource; Cantidad=0;CantidadHoy=0;
  displayedColumns: string[] = ['id_noticia',  'titulo', 'fecha_publicacion'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      
  }
  fechaFiltro:Date;
  id_reportero:string;
  nombre_completo:string;
  apepaterno:string;
  apematerno:string;
  sexo:string;
  cargo:string;
  ci:string;
  validacion:boolean;
  fotoperfil:string;
  serverImagen:string='http://localhost:3000/archivos/';
  private serverDirection :string = 'http://localhost:3000';
  constructor(public reportService:ReportService,private http:HttpClient, private reporteroService : UserService,public dialog:MatDialog) { 

    //let usuario:Reportero=JSON.parse(sessionStorage.getItem('usuarioLogeado')).user;
    reporteroService.getReportero().subscribe((_reportero : Reportero)=>{
      if(!_reportero) return;
        this.id_reportero=_reportero.id_reportero;
        this.nombre_completo=_reportero.nombre_completo;      
        this.sexo = _reportero.sexo==="M"?"Masculino":"Femenino";
        this.cargo=_reportero.cargo.toUpperCase();
        this.ci=_reportero.ci;
        this.validacion=false;      
        this.fotoperfil=this.serverImagen+_reportero.fotoperfil;
        console.log("id reporte "+this.id_reportero);
      
      this.setDataSource();
      this.DataSourceFechaHoy();
      });
       
      
  }

  ngOnInit(): void {
    
  }
  async applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    await this.reportService.getHistorialPersonal(this.id_reportero).then((data)=>{
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.Cantidad=data.length;
    })
  }
  public async DataSourceReportero(): Promise<void>{
    await this.reportService.getHistorialGeneral().then((data)=>{
      this.dataSource=data;
    })
  }

  public async DataSourceFechaHoy(): Promise<void>{
    
    console.log("tabla fecha");
    
    let data=new Date;
    let fecha=data.toDateString();
    if(fecha){
      await this.reportService.getHistorialFilterDatePersonal(this.id_reportero,fecha).then((data)=>{
        console.log(data);
        this.CantidadHoy=data.length;
      })
    }
    
  }

  public async setDataSource(): Promise<void>{

    console.log("tabla");
    
    await this.reportService.getHistorialPersonal(this.id_reportero).then((data)=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.Cantidad=data.length;
    })
  }
  async confirmarPerfil(id:string,urlP:string):Promise<void>{
  
    let exito;
    console.log(id);
    console.log(urlP);
    let nameFoto=urlP.substring(31,urlP.length);
    console.log(nameFoto);

    await this.http.post(this.serverDirection+`/confirmarfoto/${id}/${nameFoto}`,{}).toPromise()
    .then((res:any)=>{exito=res
    });
    if(exito){
      alert("Foto de perfil guardada");
      document.getElementById("btnConfirmarFoto").style. display= "none";
    }
  }

   cargarFotoPerfil(){
    var fotoPerfil:any;
    fotoPerfil=document.getElementById("fotoPerfil");
     fotoPerfil.onchange= async ()=> {
      var archivo=fotoPerfil.files[0];
      const formData:FormData=new FormData();
      formData.append("clientFile",archivo);
      let urlPerfil=this.fotoperfil= await this.http.post(`http://localhost:3000/subirArchivo/`,formData,{responseType:"text"}).toPromise()//.subscribe(resultado=>this.fotoperfil=resultado);
      
    };
    fotoPerfil.click();
    document.getElementById("btnConfirmarFoto").style. display= "flex";
    document.getElementById("btnConfirmarFoto").style.justifyContent="center";
    document.getElementById("btnConfirmarFoto").style.position="relative";
  }

  mostraropc(){
    console.log("entra");
    console.log(document.getElementById("opciones").style.display);
    
    if(document.getElementById("opciones").style.display=="inline"){
      document.getElementById("opciones").style.display="none";
    }else{
      document.getElementById("opciones").style.display="inline";
    }
    
  }
  public async DataSourceFecha(): Promise<void>{
    
    console.log(this.fechaFiltro.toDateString());
    let fecha=this.fechaFiltro.toDateString();
    if(this.fechaFiltro!=null){
      await this.reportService.getHistorialFilterDate(fecha).then((data)=>{
        this.dataSource=new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.Cantidad=data.length;
      })
    }
    
  }
  refresh(){
    this.setDataSource();
  }
 
  mostrarFormpass(){
      const dialogRes=this.dialog.open(ChangepassComponent)
      //dialogRes.afterClosed().subscribe(data=>)
  }
}
