import { Component, OnInit } from '@angular/core';
import { FormControl,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Reportero } from '../types';

interface Generos {
  value: string;
  viewValue: string;
}
interface Cargo {
  value: string;
  viewValues: string;
}

@Component({
  selector: 'app-formtest',
  templateUrl: './formtest.component.html',
  styleUrls: ['./formtest.component.scss']
})


export class FormtestComponent implements OnInit {

  generos: Generos[] = [
    {value: 'M', viewValue: 'Masculino'},
    {value: 'F', viewValue: 'Femenino'}
  ];
  cargos: Cargo[] = [
    {value: 'Administrador', viewValues: 'Administrador'},
    {value: 'Jefe de prensa', viewValues: 'Jefe de prensa'},
    {value: 'Periodista', viewValues: 'Periodista'},
    {value: 'Operador', viewValues: 'Operador'},
    {value: 'Pasante', viewValues: 'Pasante'}
  ];
  
  nameCtrl = new FormControl('', [Validators.required]);
  apepatCtrl = new FormControl('', [Validators.required]);
  apematCtrl = new FormControl('', [Validators.required]);
  cargoCtrl = new FormControl('', [Validators.required]);
  sexoCtrl = new FormControl('', [Validators.required]);
  ciCtrl = new FormControl('',[Validators.required,Validators.minLength(7)]);

  serverDirection :string = 'http://localhost:3000';


  
  constructor(private http:HttpClient) {
   }

  ngOnInit(): void {
  }
  async createUser():Promise<void>{
    /*let nombres=this.nameCtrl.value;
    let apepaterno="paterno";
    let apematerno="materno";
    let sexo="M";
    let ci="1234567";
    let cargo="Reportero";

    let id_reportero = "vqg2021133";
    let contra = "123123";
    //databinding
    let respuestaUser=null;

    await this.http.post(this.serverDirection+`/createUser/${id_reportero}/${nombres}/${apepaterno}/${apematerno}/${sexo}/${cargo}/${contra}/${ci}`,{}).toPromise()
    .then(res=>respuestaUser=res);

    if(respuestaUser){
      alert('Cuenta registrada con exito');
    }else{
      alert('Error');
    }
  }*/
  console.log(this.nameCtrl.value);
  console.log(this.cargoCtrl.value);
  console.log(this.sexoCtrl.value);
  
  
  }
}
