import { FirebaseApp } from '@angular/fire';

export class Grupo {
    idGrupo: string;
    nombre: string;
    diaSesion: string;
    lugarSesion: firebase.firestore.GeoPoint;
    direccionSesion: string;
    horaSesion: string;

    public static readonly diasSemana: DiasSemana[] = [
        {key: 1, viewValue: 'Lunes'},
        {key: 2, viewValue: 'Martes'},
        {key: 3, viewValue: 'Miercoles'},
        {key: 4, viewValue: 'Jueves'},
        {key: 5, viewValue: 'Viernes'},
    ];
}

export class DiasSemana{
    key: number;
    viewValue: string;
}


