import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  private serverDirection :string = 'http://localhost:3000';
  constructor(private http:HttpClient) { }

  getUsers():Observable<any> {
    return this.http.get(this.serverDirection);
    
  }

  ngOnInit(): void {
  }

}
