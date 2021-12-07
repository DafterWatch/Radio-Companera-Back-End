import { Component, OnInit,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reportero } from '../../types';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisableAccountComponent } from '../../dialogs/disable-account/disable-account.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(private http:HttpClient,@Inject(MAT_DIALOG_DATA)public data:any,private dialog:MatDialog) { }

  public cuentaRecuperada:Reportero;
  private serverDirection :string = 'http://localhost:3000';

  public idCreado=this.data;
  public nombre_completo:string;
  public sexo:string;
  public cargo:string;
  public ci:string;
  public habil:boolean;
  public estado:string;
  public fotoperfil:string;
  serverImagen:string='http://localhost:3000/archivos/';

  ngOnInit(): void {
    this.recuperarUser();
  }

  async recuperarUser():Promise<void>{
    let cuentas=null;
    //await this.http.get(this.serverDirection+`/probe`);
    await this.http.post(this.serverDirection+`/getUserByCI/${this.idCreado}`,{}).toPromise()
    .then((res:any)=>{
      this.cuentaRecuperada=res
      console.log(this.cuentaRecuperada);
      this.nombre_completo=this.cuentaRecuperada.nombre_completo;
      this.sexo=this.cuentaRecuperada.sexo;
      this.cargo=this.cuentaRecuperada.cargo.toUpperCase();
      this.ci=this.cuentaRecuperada.ci;
      this.habil=this.cuentaRecuperada.habilitada;
      this.fotoperfil=this.serverImagen+this.cuentaRecuperada.fotoperfil;
      if(this.habil){
        this.estado="Habilitado";
      }else{this.estado="Deshabilitado"}
      if(this.sexo=="M"){
        this.sexo="Masculino";
      }else{this.sexo="Femenino"}
      if(this.fotoperfil==null){this.fotoperfil="https://lh3.googleusercontent.com/bVasjJiEt_qOoymntYLvLmiw_uezpmQeE2O_4Kk-ZQ77bCODt5Lc0vO5Yrl4Cz7GVA";}
    });
  }

  deshabilitar(id:string){
    const dialogRes=this.dialog.open(DisableAccountComponent,{data:id})
    //dialogRes.afterClosed().subscribe(data=>)
  }
}
