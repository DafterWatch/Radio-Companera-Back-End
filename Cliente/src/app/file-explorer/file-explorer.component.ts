import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FileElement } from './model/file-element';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderComponent } from '../dialogs/new-folder/new-folder.component';
import { MatMenuTrigger } from '@angular/material/menu'
import { MediaPreviewComponent } from '../medios/media-preview/media-preview.component';
import { RenameDialogComponent } from '../dialogs/rename-dialog/rename-dialog.component';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit{
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: boolean;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{
    element: FileElement
    moveTo: FileElement
  }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  @Output() fileAdded = new EventEmitter<object>();

  constructor(public dialog: MatDialog) {}

  breakpoint : number;

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 820) ? 1 : 6;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 820) ? 1 : 6;
  }

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }else{
      this.dialog.open(MediaPreviewComponent,
      {
        panelClass: 'custom-dialog-container',
        data:{ 
          source : element.source,
          name : element.completeName,
          type: element.type,
          date : element.fechaCreacion,
          format : element.format,
          audioVideoSrc: element.audioVideoSrc
        }
      });
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }
  

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }
  
  addNewMedia(){
    let fileInput : any = document.getElementById('fileOpen');
    fileInput.onchange = ()=>{      
      this.fileAdded.emit(fileInput.files[0]);
    };
    fileInput.click();
  }

}
