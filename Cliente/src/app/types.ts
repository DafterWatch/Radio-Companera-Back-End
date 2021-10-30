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

export interface PublicidadContent{
    id_reportero:string,
    titulo:string,
    empresa:string,
    enlace:string,
    fechainicio:Date,
    fechafin:Date,
    imagepublicidad:string,
    estado:boolean
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
export interface Configuracion {
    titulo: string;
    banner: string;
}
export interface Categorias{
    id_categoria : number;
    nombre : string;
    estado : boolean;
}
export class Similarity{
    public static similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
          return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
      }
    
     static editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
      
        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
          var lastValue = i;
          for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
              costs[j] = j;
            else {
              if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                  newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
              }
            }
          }
          if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
      }
}