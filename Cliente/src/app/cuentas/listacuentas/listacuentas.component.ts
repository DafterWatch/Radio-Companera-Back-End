import { MatDialog } from '@angular/material/dialog';
import { DisableAccountComponent } from './../../dialogs/disable-account/disable-account.component';
import { UserService } from 'src/app/services/userService/user.service';
import { ReportService } from './../../services/reports/report.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface UserData {
  id_reportero: string;
  name: string;
  progress: string;
  fruit: string;
}
export interface Repor{

}



@Component({
  selector: 'app-listacuentas',
  templateUrl: './listacuentas.component.html',
  styleUrls: ['./listacuentas.component.scss']
})
export class ListacuentasComponent implements AfterViewInit {

  roomsFilter;
  valorFiltro:string="";
  fechaFiltro:Date;
  dataSource; Cantidad=0;
  displayedColumns: string[] = ['id_reportero', 'nombre', 'cargo', 'estado','sexo', 'acciones'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public reportService:UserService,private _snackBar:MatSnackBar,private dialog:MatDialog) {
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.setDataSource();    
    
  }

  async applyFilter(): Promise<void> {
    await this.reportService.probefilter(this.valorFiltro).then((data)=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.Cantidad=data.length;
    })
  }
  public async setDataSource(): Promise<void>{
    await this.reportService.getUsers().then((data)=>{
      this.dataSource=new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.Cantidad=data.length;
    })
  }
  limpiar(){
    this.valorFiltro=""
    this.setDataSource();
  }

  deshabilitar(id:string){
    const dialogRes=this.dialog.open(DisableAccountComponent,{data:id})
    //dialogRes.afterClosed().subscribe(data=>)
  }
}