import { Referencia } from './referencia';

export class Asistencia {
    idAsistencia: string;
    idSesion: string;
    idMiembro: string;
    fechaHora: firebase.firestore.Timestamp;
    asistio: boolean;
    referencia: Referencia;
    nombreCompletoMiembro: string;
    lugarSesion: string;
}
