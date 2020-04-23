export class Miembro {
    idMiembro: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    nombreCompania: string;
    profesion: string;
    email: string;
    idGrupo: string;
    nombreGrupo: string;
    avatarUrl?: string;
    esLider: boolean;
    constructor() {
        this.esLider = false;
    }
}
