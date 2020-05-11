export class Miembro {
    idMiembro: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    nombreEmpresa: string;
    profesion: string;
    email: string;
    idGrupo: string;
    nombreGrupo: string;
    avatarUrl?: string;
    esAdmGrupo: boolean;
    estado: String;
    public static readonly defaultAvatar = "default-avatar.png";
    public static readonly estadoMiembro: SelectEstado[] = [
        {key: "ACTIVO", viewValue: 'ACTIVO'},
        {key: "SUSPENDIDO", viewValue: 'SUSPENDIDO'},
        {key: "INACTIVO" ,viewValue: 'INACTIVO'}
    ];
    constructor() {
        this.esAdmGrupo  = false;
    }
}

export interface SelectEstado{
    key: String;
    viewValue: String;
}