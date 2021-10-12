import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';


interface Generos {
  value: string;
  viewValue: string;
}
interface Cargo {
  value: string;
  viewValues: string;
}
interface Extencion {
  value: string;
  viewValues: string;
}

@Component({
  selector: 'app-add-acount',
  templateUrl: './add-acount.component.html',
  styleUrls: ['./add-acount.component.scss']
})


export class AddAcountComponent implements OnInit {

  public idReport:string="";
  public nom:string="";
  public pater:string="";
  public mater:string="";
  public sex:string="";
  public carg:string="";
  public contr:string="";
  public ci:string="";
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
  extenciones: Extencion[] = [
    {value: 'CH', viewValues: 'CH'},
    {value: 'LP', viewValues: 'LP'},
    {value: 'CB', viewValues: 'CB'},
    {value: 'OR', viewValues: 'OR'},
    {value: 'PT', viewValues: 'PT'},
    {value: 'TJ', viewValues: 'TJ'},
    {value: 'SC', viewValues: 'SC'},
    {value: 'BE', viewValues: 'BE'},
    {value: 'PD', viewValues: 'PD'},
    {value:'  ',viewValues:'Otro'}
  ];
 

  serverDirection :string = 'http://localhost:3000';


  constructor(public dialogRef:MatDialogRef<AddAcountComponent>, @Inject(MAT_DIALOG_DATA)public data:any,private http:HttpClient,private snackbar:MatSnackBar) { 
    this.buildForm();}

  openSnackBar(messaje:string) {
    this.snackbar.open(messaje, 'Listo!', {
      horizontalPosition:'center',
      verticalPosition: 'top',
    });
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.form = new FormGroup({
      nameCtrl : new FormControl('', [Validators.required]),
      apepatCtrl : new FormControl('', [Validators.required]),
      apematCtrl : new FormControl('', [Validators.required]),
      cargoCtrl : new FormControl('', [Validators.required]),
      sexoCtrl : new FormControl('', [Validators.required]),
      ciCtrl : new FormControl('',[Validators.required,Validators.minLength(7),Validators.maxLength(9),Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]),
      extCtrl:new FormControl('',[Validators.required])
    });
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
get generaNumber() {
  let result = '';
  const characters = '012345678901234567890123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
  
}

async verificarCI():Promise<void>{
  
  if(this.form.valid){
    const value = this.form.value;
    let ci=value.ciCtrl;
    let existe;

    await this.http.post(this.serverDirection+`/verificarci/${ci}`,{}).toPromise()
    .then(res=>existe=res);

    if(existe){
      console.log("Error de creacion");
      
      alert("Una cuenta ya fue registrada con el CI");

    }else{
      console.log("No esta repetido");
      
      this.createUser();
    }

  }else {
    this.form.markAllAsTouched();
  }

}

async createUser():Promise<void>{
  if (this.form.valid) {
    const value = this.form.value;
console.log("Creando");



    let nombres=value.nameCtrl;
    let apepaterno=value.apepatCtrl;
    let apematerno=value.apematCtrl;
    let sexo=value.sexoCtrl;
    let ci=value.ciCtrl;
    let cargo=value.cargoCtrl;
    let ext=value.extCtrl;
 
  
    let contra = this.generaNss.substr(0,8);
    //console.log( contra );
    //databinding
    let respuestaUser=null;


    //globales
    this.idReport=ci;
    this.nom=nombres;
    this.pater=apepaterno;
    this.mater=apematerno;
    this.sex=sexo;
    this.carg=cargo;
    this.contr=contra;
    this.ci=ci+" "+ext;

    

    await this.http.post(this.serverDirection+`/crearCuenta/${ci}/${nombres}/${apepaterno}/${apematerno}/${sexo}/${cargo}/${contra}/${ci+" "+ext}`,{}).toPromise()
    .then(res=>respuestaUser=res);

    if(respuestaUser){
      //window.location.reload();
      this.openSnackBar('Cuenta creada con exito!');
      this.dialogRef.close();
      
    }else{
      this.openSnackBar('No se pudo crear la cuenta');
    }
    
  } else {
    this.form.markAllAsTouched();
  }
  }
}
