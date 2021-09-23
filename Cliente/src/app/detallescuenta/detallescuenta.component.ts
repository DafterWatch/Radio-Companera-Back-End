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

  ngOnInit(): void {
    
  }

  async recuperarUser():Promise<void>{
    let cuentas=null;
    //await this.http.get(this.serverDirection+`/probe`);
    await this.http.post(this.serverDirection+`/getUserByCI/${this.idCreado}`,{}).toPromise()
    .then((res:any)=>{
      this.cuentaRecuperada=res
      console.log(this.cuentaRecuperada);
    });
  }
  mostrarID(){
    console.log("CI EN LOG "+this.idCreado);
    if(this.idCreado!=null){
      this.recuperarUser();
    }
  }
}
