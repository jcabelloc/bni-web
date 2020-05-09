import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Miembro } from '../models/miembro';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';

@Injectable({
  providedIn: 'root'
})
export class MiembroService {

  private miembrosCollection: AngularFirestoreCollection<Miembro>;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.miembrosCollection = afs.collection<Miembro>('miembros');
  }

  getMiembros(): Observable<Miembro[]> {

    return this.miembrosCollection.valueChanges({ idField: 'idMiembro' });
  }

  createMiembro(miembro: Miembro): Observable<string> {

    let idMiembro: Observable<string>;
    idMiembro = from(this.miembrosCollection.add({ ...miembro })).pipe(map(document => document.id));
    return idMiembro;

  }

  deleteMiembro(id: string): Observable<void> {
    return from(this.miembrosCollection.doc(id).delete());
  }

  getAvatarImgUrl(rutaImageProfile: string): Observable<any> {
    const ref = this.storage.ref('avatar_miembros/' + rutaImageProfile);
    return ref.getDownloadURL();
  }

  uploadAvatar(idMiembro: string, file: File): Observable<any> {

    const filePath = "avatar_miembros/" + idMiembro;
    this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return from(task);
  }
  updateMiembro(miembro: Miembro): Observable<void> {
    return from(this.miembrosCollection.doc(miembro.idMiembro).update({ ...miembro }));
  }

  getMiembroById(idMiembro: string): Observable<Miembro> {
    return this.miembrosCollection.doc<Miembro>(idMiembro).valueChanges().pipe(map(document => {
      document.idMiembro = idMiembro;
      return document;
    }));
  }

  getMiembrosByIdGrupo(idGrupo: string): Observable<Miembro[]> {
    return this.afs.collection<Miembro>('miembros', ref => ref.where('idGrupo', '==', idGrupo)).valueChanges({ idField: 'idMiembro' });
  }
}
