import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-detalles-cuenta',
  templateUrl: './detalles-cuenta.component.html',
  styleUrls: ['./detalles-cuenta.component.scss']
})
export class DetallesCuentaComponent implements OnInit {

  @Input() id_reportero : string;
  nombres : string;
  apepaterno : string;
  apematerno : string;
  sexo : string;
  cargo : string;
  contra : string;
  ci : string;
  habilitada : boolean    

  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
