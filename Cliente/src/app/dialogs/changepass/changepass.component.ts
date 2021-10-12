import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService/user.service';
import { Reportero } from 'src/app/types';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.scss']
})
export class ChangepassComponent implements OnInit {

  id_reportero:string;
  passactual:string;
  constructor(public dialogRef:MatDialogRef<ChangepassComponent>,private http:HttpClient, private reporteroService : UserService,private snackbar:MatSnackBar) { 
    
    //let usuario:Reportero=JSON.parse(sessionStorage.getItem('usuarioLogeado')).user;
    reporteroService.getReportero().subscribe((_reportero : Reportero)=>{
        this.id_reportero=_reportero.id_reportero;      
      });
      this.getPassActual();
      
  }
async getPassActual(){
  await this.reporteroService.getReportero().subscribe(reportero =>{
    this.passactual = reportero.contraseña;
    console.log(reportero);
    
  } );
  console.log(this.passactual);
}
  openSnackBar(messaje:string) {
    this.snackbar.open(messaje, 'Listo!', {
      horizontalPosition:'center',
      verticalPosition: 'top',
    });
  }

  ngOnInit(): void {
  }
  public validar(contraactual:string,contrasenia1:string, contrasenia2:string){
    if(contraactual===this.passactual){
      if(contrasenia1.length>=1){
        if(contrasenia1===contrasenia2){
          this.cambiarContrasenia(contrasenia1);
          this.openSnackBar("Cambiaste tu contraseña")
          document.getElementById("cambiopass").style.display="none";
        }
        else{
          this.openSnackBar("Las contraseñas no coinciden")
        }
      }
      else{
        this.openSnackBar("Contraseña invalida")
      }
    }else{
      this.openSnackBar("Contraseña actual incorrecta")
    }
    
  }
  async cambiarContrasenia(contraseniaNueva:string): Promise<void> {
    await this.http.post(`http://localhost:3000/cambiarContrasenia/${this.id_reportero}/${contraseniaNueva}`,{}).toPromise().then(resultado=>{});
  }
  close(){
    this.dialogRef.close();
  }
}
