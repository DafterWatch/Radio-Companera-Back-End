import { ThisReceiver } from '@angular/compiler';
import { Reportero } from './../types';
import { Component, OnInit,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detallescuenta',
  templateUrl: './detallescuenta.component.html',
  styleUrls: ['./detallescuenta.component.scss']
})
export class DetallescuentaComponent implements OnInit {

  constructor(private http:HttpClient) {}
  public cuentaRecuperada:Reportero;
  private serverDirection :string = 'http://localhost:3000';

  @Input() idCreado:string;
  @Input() pass:string;

  ngOnInit(): void {
    
  }

  nombres:string;
  paterno:string;
  materno:string;
  sexo:string;
  cargo:string;
  ci:string;
  habil:boolean;
  password:string;
  estado:string;

  async recuperarUser():Promise<void>{
    let cuentas=null;
    //await this.http.get(this.serverDirection+`/probe`);
    await this.http.post(this.serverDirection+`/getUserByCI/${this.idCreado}`,{}).toPromise()
    .then((res:any)=>{
      this.cuentaRecuperada=res
      console.log(this.cuentaRecuperada);
      this.nombres=this.cuentaRecuperada.nombres;
      this.paterno=this.cuentaRecuperada.apepaterno;
      this.materno=this.cuentaRecuperada.apematerno;
      this.sexo=this.cuentaRecuperada.sexo;
      this.cargo=this.cuentaRecuperada.cargo.toUpperCase();
      this.ci=this.cuentaRecuperada.ci;
      this.habil=this.cuentaRecuperada.habilitada;
      this.password=this.pass;

      if(this.habil){
        this.estado="HABILITADO";
      }else{this.estado="DESHABILITADO"}
      if(this.sexo=="M"){
        this.sexo="MASCULINO";
      }else{this.sexo="FEMENINO"}
    });
  }
  mostrarID(){
    console.log("CI EN LOG "+this.idCreado);
    if(this.idCreado!=null){
      this.recuperarUser();
    }
  }
}
