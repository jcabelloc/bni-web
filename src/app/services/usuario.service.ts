import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuariosCollection: AngularFirestoreCollection<Usuario>;

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.usuariosCollection = afs.collection<Usuario>('usuarios');
  }

  getUsuarioById(idUsuario: string): Observable<Usuario> {
    return this.usuariosCollection.doc<Usuario>(idUsuario).valueChanges().pipe(map(document => {
      document.uid = idUsuario;
      return document;
    }));
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.usuariosCollection.valueChanges({ idField: 'uid' });
  }

  getAvatarImgUrl(rutaImageProfile: string): Observable<any> {
    const ref = this.storage.ref('avatar_miembros/' + rutaImageProfile);
    return ref.getDownloadURL();
  }

  createUsuario(usuario: Usuario, passwordInicial: string): Observable<void> {
    let uid: string
    uid = this.afs.createId();
    return from(this.usuariosCollection.doc(uid).set({ ...usuario , passwordInicial: passwordInicial}));
  }

  updateUsuario(usuario: Usuario, idUsuario: string, passwordNuevo: string) : Observable<void>{
    return from(this.usuariosCollection.doc(idUsuario).update({ ...usuario, passwordInicial: passwordNuevo }));
  }

  uploadAvatar(idMiembro: string, file: File): Observable<any> {
    const filePath = "avatar_miembros/" + idMiembro;
    this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return from(task);
  }
}
