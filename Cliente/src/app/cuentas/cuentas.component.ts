import { DetailAcountComponent } from './../dialogs/detail-acount/detail-acount.component';
import { DisableAccountComponent } from './../dialogs/disable-account/disable-account.component';
import { DetailsComponent } from './../dialogs/details/details.component';
import { AddAcountComponent } from './../dialogs/add-acount/add-acount.component';
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
  serverImagen:string='http://localhost:3000/archivos/';
  private serverDirection :string = 'http://localhost:3000';

  constructor(private http:HttpClient,private dialog:MatDialog) {}

  


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
  refresh(){
    this.getCuentas();
  }


  detallescuenta(id:string){
    const dialogRes=this.dialog.open(DisableAccountComponent,{data:id})
    //dialogRes.afterClosed().subscribe(data=>)
  }
  deshabilitar(id:string){
    const dialogRes=this.dialog.open(DetailsComponent,{data:id})
    //dialogRes.afterClosed().subscribe(data=>)
  }
  openCreateUser(){
this.dialog.open(AddAcountComponent);
  }
}
