import { MatTabsModule } from '@angular/material/tabs';
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
import { EntradasComponent } from './entradas-component/entradas/entradas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AjustesComponent } from './ajustes/ajustes.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { MediosComponent } from './medios/medios.component';
import { CuentasComponent } from './cuentas/cuentas.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { FormtestComponent } from './formtest/formtest.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { CustomPaginator } from '../app/medios/paginatorConfig';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MediaPreviewComponent } from './medios/media-preview/media-preview.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { NewFolderComponent } from './dialogs/new-folder/new-folder.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { RenameDialogComponent } from './dialogs/rename-dialog/rename-dialog.component';
import { DetallescuentaComponent} from './detallescuenta/detallescuenta.component'
import {MatExpansionModule} from '@angular/material/expansion';
import { NuevaEntradaComponent } from './entradas-component/nueva-entrada/nueva-entrada.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FileExplorerMiniComponent } from './entradas-component/file-explorer-mini/file-explorer-mini.component';
import {MatTreeModule} from '@angular/material/tree';
import { AddTagDialogComponent } from './dialogs/add-tag-dialog/add-tag-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AddAcountComponent } from './dialogs/add-acount/add-acount.component';
import { DetailsComponent } from './dialogs/details/details.component';
import { DisableAccountComponent } from './dialogs/disable-account/disable-account.component';
import { EditEntradaComponent } from './entradas-component/edit-entrada/edit-entrada.component';
import { ChangepassComponent } from './dialogs/changepass/changepass.component';
import { ListacuentasComponent } from './cuentas/listacuentas/listacuentas.component';
import { InforeportEditComponent } from './dialogs/inforeport-edit/inforeport-edit.component';
import { PruebaComponent } from './prueba/prueba.component';
import { ConfirmDeleteComponent } from './dialogs/confirm-delete/confirm-delete.component';
import { ConfirmModifyComponent } from './dialogs/confirm-modify/confirm-modify.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PublicidadesComponent } from './dialogs/publicidades/publicidades.component';
import { EditPublicidadComponent } from './dialogs/publicidades/edit-publicidad/edit-publicidad.component';
import { EditestadoComponent } from './dialogs/publicidades/editestado/editestado.component';
import { PublicidadComponent } from './publicidad/publicidad.component';

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
    CuentasComponent,
    FormtestComponent,
    MediaPreviewComponent,
    FileExplorerComponent,
    NewFolderComponent,
    DetallescuentaComponent,
    RenameDialogComponent,
    NuevaEntradaComponent,
    FileExplorerMiniComponent,
    AddTagDialogComponent,
    AddAcountComponent,
    DetailsComponent,
    DisableAccountComponent,
    EditEntradaComponent,
    ChangepassComponent,
    ListacuentasComponent,
    InforeportEditComponent,
    PruebaComponent,
    ConfirmDeleteComponent,
    ConfirmModifyComponent,
    PublicidadesComponent,
    EditPublicidadComponent,
    EditestadoComponent,
    PublicidadComponent,
    
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatRadioModule,
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
    HttpClientModule,
    MatPaginatorModule,
    MatDialogModule,
    MatGridListModule,
    MatExpansionModule,
    AngularEditorModule,
    MatTreeModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
