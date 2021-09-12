import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-crearcuenta',
  templateUrl: './crearcuenta.component.html',
  styleUrls: ['./crearcuenta.component.scss']
})
export class CrearcuentaComponent implements OnInit {

  //formulario
  emailCtrl= new FormControl('',[]);



  constructor(private Http:HttpClient) { }
  //nombreuser:string;
  serverDirection :string = 'http://localhost:3000';

  async createUser():Promise<void>{
    let nombres:any=document.getElementById("uname");
    let apepaterno:any=document.getElementById("appaterno");
    let apematerno:any=document.getElementById("apmaterno");
    let sexo:any=document.getElementById("sexo");
    let ci:any=document.getElementById("ciuser");
    let cargo:any=document.getElementById("cargo");

    let id_reportero = "gvq";
    let contra = "123123";
    //databinding
    let respuestaUser=null;
    /*
    await this.Http.post(this.serverDirection+`/${this.nombreuser}/${nombres.value}/${ss.value}`,{}).toPromise()
    .then(res=>respuestaUser=res);
    */
   ///createUser/:id_reportero/:nombres/:apepaterno/:apematerno/:sexo/:cargo/:contra/:ci
    await this.Http.post(this.serverDirection+`/${id_reportero}/${nombres.value}/${apepaterno.value}/${apematerno.value}/${sexo.value}/${cargo.value}/${contra}/${ci.value}`,{}).toPromise()
    .then(res=>respuestaUser=res);
    if(respuestaUser){
      alert('Cuenta registrada con exito');
    }
  }

  ngOnInit(): void {
  }

}
