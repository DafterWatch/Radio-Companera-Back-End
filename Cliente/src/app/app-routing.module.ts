import { FormtestComponent } from './formtest/formtest.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './ajustes/ajustes.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { EntradasComponent } from './entradas-component/entradas/entradas.component';
import { NuevaEntradaComponent } from './entradas-component/nueva-entrada/nueva-entrada.component'
import { EscritorioComponent } from './escritorio/escritorio.component';
import { MediosComponent } from './medios/medios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DetallescuentaComponent } from './detallescuenta/detallescuenta.component';
import { FileExplorerMiniComponent } from './entradas-component/file-explorer-mini/file-explorer-mini.component';
import { EditEntradaComponent } from './entradas-component/edit-entrada/edit-entrada.component';
import { PruebaComponent } from './prueba/prueba.component';

const routes: Routes = [  
  {
    path:'',    
    component:EscritorioComponent
  },    
  {
    path:'escritorio',
    component:EscritorioComponent
  },
  {
    path:'entradas',
    component:EntradasComponent
  },
  {
    path:'entradas/edit',
    component:EditEntradaComponent
  },
  {
    path:'nueva-entrada',
    component:NuevaEntradaComponent
  },
  {
    path:'medios',
    component:MediosComponent
  },
  {
    path:'comentarios',
    component:ComentariosComponent
  },
  {
    path:'cuentas',
    component:CuentasComponent
  },
  {
    path:'cuentas/crearcuenta',
    component:FormtestComponent
  },
  {
    path:'perfil',
    component:PerfilComponent
  },
  {
    path:'ajustes',
    component:AjustesComponent
  },{
    path:'cuentas/crearcuenta/detalles',
    component:DetallescuentaComponent
  },{
    path:'prueba',
    component:PruebaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
