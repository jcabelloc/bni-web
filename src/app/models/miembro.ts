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
    estado: Estado;
    constructor() {
        this.esAdmGrupo  = false;
    }
}

enum Estado {
    ACTIVO,
    SUSPENDIDO,
    INACTIVO,
}