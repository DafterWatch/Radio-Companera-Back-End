import { Component,Input, Output,EventEmitter } from '@angular/core';
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
  @Output() sessionClose : EventEmitter<void> = new EventEmitter<void>();

  constructor(private breakpointObserver: BreakpointObserver) {
    
  }
  cerrarSesion(){
    this.sessionClose.emit();
  }
}
