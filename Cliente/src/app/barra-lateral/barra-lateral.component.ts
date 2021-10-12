import { Component,Input, Output,EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Permisos, Reportero } from '../types';
import { UserService } from '../services/userService/user.service';

@Component({
  selector: 'app-barra-lateral',
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.scss']
})
export class BarraLateralComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );   
  _permisos : Permisos;
  currentUser : Reportero;
  @Output() sessionClose : EventEmitter<void> = new EventEmitter<void>();

  constructor(private breakpointObserver: BreakpointObserver, private _usuarioService : UserService) {
    _usuarioService.getReportero().subscribe((_reportero : Reportero)=> {
      this.currentUser = _reportero;
      this._permisos = _usuarioService.getPermisos();
    });
  }
  cerrarSesion(){
    this.sessionClose.emit();
  }
}
