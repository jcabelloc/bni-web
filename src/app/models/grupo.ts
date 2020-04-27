import { FirebaseApp } from '@angular/fire';

export class Grupo {
    idGrupo: string;
    nombre: string;
    diaSesion: string;
    lugarSesion: firebase.firestore.GeoPoint;
    direccionSesion: string;
    horaSesion: string;

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


