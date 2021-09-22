import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reportero } from '../types';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  
  
  public logcuentas:Reportero[];
  private serverDirection :string = 'http://localhost:3000';
  constructor(private http:HttpClient) {}

  
  public confirmar(id:string):void{
    document.getElementById(id).style.display='inline';
 }
 refresh(): void { window.location.reload(); }

 public ocultarConfirmacion(id:string):void{
  document.getElementById(id).style.display='none';
}

async deshabiliarcuenta(id:string):Promise<void>{
  
  let exito;
  //await this.http.get(this.serverDirection+`/probe`);
  await this.http.post(this.serverDirection+`/deshabilitarUser/${id}`,{}).toPromise()
  .then((res:any)=>{exito=res
  });
  if(exito){
    alert("Cuenta deshabilitada");
  }
}

   public mostrarDatos():void{
    document.getElementById("formRegistro").style.display='none';
      
    document.getElementById('tablaCuentas').style.display='inline';
   }
  getUsers():Observable<any> {
    return this.http.get(this.serverDirection);
  }

 

  async getCuentas():Promise<void>{
    let cuentas=null;
    //await this.http.get(this.serverDirection+`/probe`);
    await this.http.post(this.serverDirection+`/probe`,{}).toPromise()
    .then((res:any)=>{this.logcuentas=res
    console.log(this.logcuentas);
    
    });
  }

  ngOnInit(): void {
    console.log("cls");
    
    this.getCuentas();
    console.log(this.logcuentas);

    
  }
}
