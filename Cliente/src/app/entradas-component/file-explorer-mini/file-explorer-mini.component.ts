import { Component, OnInit,Inject } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import { FileElement } from 'src/app/file-explorer/model/file-element';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
interface MediaNode{
  name: string;
  id:string;
  children?:MediaNode[];
  src?:string;  
  type?:string;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  src?:string;
}

@Component({
  selector: 'app-file-explorer-mini',
  templateUrl: './file-explorer-mini.component.html',
  styleUrls: ['./file-explorer-mini.component.scss']
})
export class FileExplorerMiniComponent implements OnInit {

  private map : Map<string,FileElement> = new Map<string,FileElement>();
  TREE_DATA: MediaNode[] = [];
  private mapParsed =[];
  constructor(private http:HttpClient, @Inject(MAT_DIALOG_DATA) public data) {    
    this.getMap();      
  }
  ngOnInit(): void {
  }
  private async getMap(){
    await this.http.get('http://localhost:3000/getSchema',{responseType:'text'}).toPromise().then(res=>{
      if(res !==''){
        this.map = new Map(JSON.parse(res)); 
      }
    });
    this.parseMapToTree();
    this.dataSource.data = this.TREE_DATA;
  }

  private _transformer = (node: MediaNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      src:node.src,
      type:node.type
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);  

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  private parseMapToTree(){
    for(let [key, value] of this.map){
      if(value.parent === 'root'){
          this.insert(this.mapParsed,value);
      }else{
          this.findAndAppend(this.mapParsed, value);
      }
    }            
    
    this.TREE_DATA = this.mapParsed;
  }

  findAndAppend(parentList,child,parent=undefined){
    if(parent && child.parent === parent.id){
        this.insert(parent.children, child);
        return true;
    }
    
    for(let value of parentList){
        if(value.children){
            let finded = this.findAndAppend( value.children, child, value );
            if(finded){
                return true;
            }
        }    
    }
    return false;
  }

  private insert(parent, child){
    if(child.isFolder){
        parent.push({name : child.name, children: [], id:child.id});   
    }else
        parent.push({name : child.name, id:child.id, src:child.source || child.audioVideoSrc, type:child.type});   
  }

}
