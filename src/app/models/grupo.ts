import { FirebaseApp } from '@angular/fire';

export class Grupo {
    idGrupo?: string;
    nombre: string;
    diaSesion: string;
    ubicacionSesion: firebase.firestore.GeoPoint;
    direccionSesion: string;
    lugarSesion: string;
    horaSesion: string;
    ultimaGeneracion: number;
    avatarUrl?: string;
    public static readonly defaultAvatar = "default-avatar.jpg";
    public static readonly diasSemana: DiasSemana[] = [
        {key: 'LUNES', viewValue: 'Lunes'},
        {key: 'MARTES', viewValue: 'Martes'},
        {key: 'MIERCOLES', viewValue: 'Miercoles'},
        {key: 'JUEVES', viewValue: 'Jueves'},
        {key: 'VIERNES', viewValue: 'Viernes'},
    ];
}

export class DiasSemana{
    key: string;
    viewValue: string;
}


