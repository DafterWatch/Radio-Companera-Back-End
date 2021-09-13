import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Reportero } from '../types';
import { debounceTime } from 'rxjs/operators';

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

  //form group
  form:FormGroup;

//valores para los selects
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
  
 

  serverDirection :string = 'http://localhost:3000';


  
  constructor(private http:HttpClient) {
    this.buildForm();
   }


  private buildForm() {
    this.form = new FormGroup({
      nameCtrl : new FormControl('', [Validators.required]),
      apepatCtrl : new FormControl('', [Validators.required]),
      apematCtrl : new FormControl('', [Validators.required]),
      cargoCtrl : new FormControl('', [Validators.required]),
      sexoCtrl : new FormControl('', [Validators.required]),
      ciCtrl : new FormControl('',[Validators.required,Validators.minLength(7)])
    });

    /*this.form.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(value => {
      console.log(value);
    });*/
  }

  ngOnInit(): void {
  }

  get nombreField(){
    return this.form.get('nameCtrl')
  }
  get apepatField(){
    return this.form.get('apepatCtrl')
  }
  get apematField(){
    return this.form.get('apematCtrl')
  }
  get cargoField(){
    return this.form.get('cargoCtrl')
  }
  get sexoField(){
    return this.form.get('sexoCtrl')
  }
  get ciField(){
    return this.form.get('ciCtrl')
  }
  get generaNss() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678901234567890123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
    
}


  async createUser():Promise<void>{
  if (this.form.valid) {
    const value = this.form.value;

    let nombres=value.nameCtrl;
    let apepaterno=value.apepatCtrl;
    let apematerno=value.apematCtrl;
    let sexo=value.sexoCtrl;
    let ci=value.ciCtrl;
    let cargo=value.cargoCtrl;

    let cargoIniciales;
    switch(cargo) { 
      case 'Administrador': { 
         cargoIniciales="admin"
         break; 
      } 
      case 'Jefe de prensa': { 
        cargoIniciales="jp"
         break; 
      } 
      case 'Periodista': { 
        cargoIniciales="per"
        break; 
     }
     case 'Operador': { 
      cargoIniciales="ope"
      break; 
   }
   case 'Pasante': { 
    cargoIniciales="pas"
    break; 
 }
      default: { 
        cargoIniciales="null"
         break; 
      } 
   } 
    let id_reportero = nombres.substr(0,1)
                      +apepaterno.substr(0,1)
                      +apematerno.substr(0,1)
                      +"-"
                      +cargoIniciales
                      +ci.substr(4,ci.length);
    console.log(id_reportero);
    
    let contra = this.generaNss.substr(0,8);
    //console.log( contra );
    //databinding
    let respuestaUser=null;

    await this.http.post(this.serverDirection+`/createUser/${id_reportero}/${nombres}/${apepaterno}/${apematerno}/${sexo}/${cargo}/${contra}/${ci}`,{}).toPromise()
    .then(res=>respuestaUser=res);

    if(respuestaUser){
      alert('Cuenta registrada con exito');
    }else{
      alert('Error');
    }
    
  } else {
    this.form.markAllAsTouched();
  }
  }
}
