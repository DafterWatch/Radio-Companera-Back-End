import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-formtest',
  templateUrl: './formtest.component.html',
  styleUrls: ['./formtest.component.scss']
})
export class FormtestComponent implements OnInit {

  emailCtrl = new FormControl('', []);
  constructor() { }

  ngOnInit(): void {
  }

}
