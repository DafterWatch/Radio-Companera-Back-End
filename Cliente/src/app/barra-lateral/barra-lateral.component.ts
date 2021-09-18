import { Component,Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Permisos } from '../types';

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
  @Input() permisos : Permisos = {counts:false, settings:false};  

  constructor(private breakpointObserver: BreakpointObserver) {
    console.log(this.permisos);    
  }
  cerrarSesion(){
    //TODO: Emitir evento para cerrar la sesión
  }
}
