import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {

  constructor(private http:HttpClient) { }

  comentarios:Comentarios[]=[]
  ngOnInit(): void {
    this.getComentario();
  }

  async getComentario():Promise<void>{
    await this.http.get(`http://localhost:3000/getComentarios`,{}).toPromise()
    .then((res:any)=>{this.comentarios=res
    //console.log(this.comentarios);
    });
  }

  /*borrarComentario(id:number){
    console.log(id)
  }*/

  async borrarComentario(id:number):Promise<void>{
    let exito;
    await this.http.post(`http://localhost:3000/borrarComentario/${id}`,{}).toPromise()
    .then((res:any)=>{exito=res
    });
    if(exito){
      alert(`Comentario con id:${id} borrado exitosamente.`);

      //window.location.reload();
    }
  }
}

interface Comentarios{  
  id_comentario: number;
  id_noticia: number;
  fecha: string;
  nombre: string;
  contenido: string;
}