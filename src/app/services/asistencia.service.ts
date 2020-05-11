import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Asistencia } from '../models/asistencia';


@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private asistenciasCollection: AngularFirestoreCollection<Asistencia>;

  constructor(private afs: AngularFirestore) {
    this.asistenciasCollection = afs.collection<Asistencia>('asistencias');
  }


  getAsistenciasByIdGrupo(idGrupo: string): Observable<Asistencia[]> {
    return this.afs.collection<Asistencia>('asistencias', ref => ref.where('idGrupo', '==', idGrupo)).valueChanges({ idField: 'idAsistencia' });
  }

  getAsistencias(): Observable<Asistencia[]> {
    return this.asistenciasCollection.valueChanges({idField:'idAsistencia'});
  }

  getAsistenciasByIdMiembro(idMiembro: string): Observable<Asistencia[]> {
    return this.afs.collection<Asistencia>('asistencias', ref => ref.where('idMiembro', '==', idMiembro)).valueChanges({ idField: 'idAsistencia' });
  }
}
