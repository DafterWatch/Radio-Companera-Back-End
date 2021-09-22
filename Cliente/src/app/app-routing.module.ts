import { DetallesCuentaComponent } from './detalles-cuenta/detalles-cuenta.component';
import { FormtestComponent } from './formtest/formtest.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './ajustes/ajustes.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import { EntradasComponent } from './entradas/entradas.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { MediosComponent } from './medios/medios.component';
import { PerfilComponent } from './perfil/perfil.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
