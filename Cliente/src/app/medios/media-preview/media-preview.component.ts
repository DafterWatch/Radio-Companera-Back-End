import { Component,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) {}

}
