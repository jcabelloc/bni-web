import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
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
  deleteMiembro(id: string) : Observable<void>{
    return from(this.miembrosCollection.doc(id).delete());
  }

  getAvatarImgUrl(rutaImageProfile: string): Observable<any>{
    const ref = this.storage.ref('avatar_miembros/' + rutaImageProfile);
    return ref.getDownloadURL();
  }

  uploadAvatar(idMiembro: string, file: File) {
    //TODO Pendiente, revisar lka devolución de un observable
    const filePath = "avatar_miembros/"+ idMiembro;
    this.storage.ref(filePath);
    this.storage.upload(filePath,file);
  }
}
