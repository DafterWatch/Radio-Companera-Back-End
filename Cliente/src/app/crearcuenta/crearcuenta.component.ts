import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crearcuenta',
  templateUrl: './crearcuenta.component.html',
  styleUrls: ['./crearcuenta.component.scss']
})
export class CrearcuentaComponent implements OnInit {

  constructor(private Http:HttpClient) { }
  nombreuser:string;
  serverDirection :string = 'http://localhost:3000';

  async createUser():Promise<void>{
    let nomuser:any=document.getElementById("uname");
    let s=document.getElementById("uname");
    let ss=document.getElementById("uname");
    let sss=document.getElementById("uname");
    let ssss=document.getElementById("uname");
    //databinding
    let respuestaUser=null;
    await this.Http.post(this.serverDirection+`/${this.nombreuser}/${nomuser.value}/${ss.value}`,{}).toPromise()
    .then(res=>respuestaUser=res);

    if(respuestaUser)


    ...logica
  }

  ngOnInit(): void {
  }

}
