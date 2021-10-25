export class Reportero{
    id_reportero : string;
    nombres : string;
    apepaterno : string;
    apematerno : string;
    sexo : string;
    cargo : string;
    contraseña : string;
    ci : string;
    habilitada : boolean
    fotoperfil:string  
}

export class Permisos{
    CREAR_CUENTAS :             boolean;
    ELIMINAR_COMENTARIOS :      boolean;
    BORRAR_NOTICIAS_AJENAS :    boolean;
    BORRAR_NOTICIAS_PROPIAS :   boolean;
    MODIFICAR_NOTICIAS_AJENAS : boolean;
    MODIFICAR_NOTICIAS_PROPIAS :boolean;
    CREAR_NOTICIAS :            boolean;
}
export class getUserType{
    usuario : Reportero;
    permisos : Permisos;
}

export class Notice{
    id_noticia? : number;
    id_reportero : string;
    ultima_modificacion? : string; 
    fecha : Date;
    estado : boolean;
}

export class Notice_Content{
    id_noticia : number;
    id_contenido? : number;
    imagen_portada : string;
    titulo : string;
    contenido : string;
    etiquetas : string[];
}

export interface Entradas {
    id_noticia: number;
    titulo: string;
    autor: string;
    etiquetas: string[];
    fecha: string;
    estado: boolean;
    categoria: string;
    id_reportero:number;
}

export interface Publicidad {
    id_publicidad: number;
    titulo: string;
    empresa: string;
    autor: string;
    fechainicio:string;
    fechafin:string;
    estado:boolean;
  }