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