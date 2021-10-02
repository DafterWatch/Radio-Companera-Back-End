import { Injectable } from '@angular/core';
import { Reportero } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private _reportero :Reportero;

  setReportero(reportero : Reportero){
    this._reportero = reportero;
  }
  public getReportero() : Reportero{
    return this._reportero;
  }
}
