export class FileElement {
    id?: string;
    isFolder: boolean;
    name: string;
    parent: string;
    source? : string;
    type?: string;
    format? : string
    fechaCreacion?:Date;
    completeName?:string;
    audioVideoSrc?:string;
}