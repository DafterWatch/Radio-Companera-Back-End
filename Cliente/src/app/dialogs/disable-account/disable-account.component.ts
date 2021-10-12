import { DetailsComponent } from './../details/details.component';
import { Component, OnInit,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reportero } from '../../types';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-disable-account',
  templateUrl: './disable-account.component.html',
  styleUrls: ['./disable-account.component.scss']
})
export class DisableAccountComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<DetailsComponent>, @Inject(MAT_DIALOG_DATA)public data:any,private http:HttpClient, private snackbar:MatSnackBar) { }

  public idCuenta=this.data;
  ngOnInit(): void {
  }
  private serverDirection :string = 'http://localhost:3000';

  async deshabiliarcuenta(id:string):Promise<void>{
  
    
    let exito;
    //await this.http.get(this.serverDirection+`/probe`);
    await this.http.post(this.serverDirection+`/deshabilitarUser/${id}`,{}).toPromise()
    .then((res:any)=>{exito=res
    });
    if(exito){
      this.openSnackBar("Cuenta deshabilitada");
      this.dialogRef.close();
    }
  }

  openSnackBar(messaje:string) {
    this.snackbar.open(messaje, 'Listo!', {
      horizontalPosition:'center',
      verticalPosition: 'top',
    });
  }
  cerrar(){
    this.dialogRef.close();
  }
}
