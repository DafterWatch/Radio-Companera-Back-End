import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BarraLateralComponent } from './barra-lateral/barra-lateral.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { EntradasComponent } from './entradas/entradas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { MediosComponent } from './medios/medios.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { HttpClient, HttpClientModule} from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    BarraLateralComponent,
    EscritorioComponent,
    EntradasComponent,
    PerfilComponent,
    AjustesComponent,
    ComentariosComponent,
    MediosComponent,
    CuentasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    ScrollingModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    LayoutModule,
    MatToolbarModule,
    MatCheckboxModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
