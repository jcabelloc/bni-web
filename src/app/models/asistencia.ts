import { Referencia } from './referencia';

export class Asistencia {
    idAsistencia: string;
    idSesion: string;
    idMiembro: string;
    idGrupo: string;
    fechaHora: firebase.firestore.Timestamp;
    asistio: boolean;
    referencia: Referencia;
    nombreCompletoMiembro: string;
    lugarSesion: string;
    nombreGrupo: String;
}
