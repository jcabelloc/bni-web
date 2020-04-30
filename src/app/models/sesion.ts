export class Sesion {
    idSesion: string;
    ubicacion: firebase.firestore.GeoPoint;
    direccion: string;
    lugar: string;
    fechaHora: firebase.firestore.Timestamp;
    idGrupo: string;

    public static readonly valueDia = new Map<string,number>([
        ['LUNES', 1],
        ['MARTES', 2],
        ['MIERCOLES',3],
        ['JUEVES', 4],
        ['VIERNES',5],
    ]);

}
