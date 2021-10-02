import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerMiniComponent } from './file-explorer-mini.component';

describe('FileExplorerMiniComponent', () => {
  let component: FileExplorerMiniComponent;
  let fixture: ComponentFixture<FileExplorerMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileExplorerMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExplorerMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
