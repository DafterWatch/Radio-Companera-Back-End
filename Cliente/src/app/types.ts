export class Reportero{
    id_reportero : string;
    nombres : string;
    apepaterno : string;
    apematerno : string;
    sexo : string;
    cargo : string;
    contra : string;
    ci : string;
    habilitada : boolean
    fotoperfil:string  
}

export class Permisos{
    counts : boolean;
    settings : boolean;
}
export class getUserType{
    usuario : Reportero;
    permisos : Permisos;
}

