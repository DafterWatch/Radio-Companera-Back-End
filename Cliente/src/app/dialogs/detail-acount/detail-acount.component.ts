import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { SnackBarExampleComponent } from './../snack-bar-example/snack-bar-example.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/userService/user.service';
import { comunicacionComponentesService } from 'src/app/services/comunicacionComponentesService/comunicacionComponentes.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-acount',
  templateUrl: './detail-acount.component.html',
  styleUrls: ['./detail-acount.component.scss']
})
export class DetailAcountComponent implements OnInit {


  constructor(public clip: Clipboard,private _snackBar:MatSnackBar,private userService:UserService,private dialogRef:MatDialogRef<DetailAcountComponent>,private serviceComu:comunicacionComponentesService) {
    dialogRef.disableClose = true;
   
   }
  idReportCreado;

   NombreCompleto:string;
   Cargo:string;
   CI:string;
   CODIGO:string;
   password:string;

   habilitada:boolean;
   review_btn=false;


  ngOnInit(): void {
this.idReportCreado=this.serviceComu.getAcount();
this.getReport();
this.review_btn=true;
document.getElementById("btnCerrar").style.backgroundColor="black";
document.getElementById("btnCerrar").style.color="white";
  }

  async getReport(){
    let datos=await this.userService.getUserCreado(this.idReportCreado);
    this.NombreCompleto=datos.nombre_completo;
    this.Cargo=datos.cargo;
    this.CI=datos.ci;
    this.CODIGO=datos.id_reportero;
    this.password=datos.contraseña;
    
  }

  cambiar(){
    
    if(this.habilitada){
      this.review_btn=false;
      document.getElementById("btnCerrar").style.backgroundColor="red";
      document.getElementById("btnCerrar").style.color="white";
    }else{
      this.review_btn=true;
      document.getElementById("btnCerrar").style.backgroundColor="black";
      document.getElementById("btnCerrar").style.color="white";
    }
    
  }
  cerrarDialog(){
    this.dialogRef.close();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarExampleComponent, {
      duration: 2000
    });
  }
  
  copyHeroName() {
    this.openSnackBar()
    this.clip.copy('ID: '+this.CODIGO+'  Contraseña: '+this.password);
  }
}
