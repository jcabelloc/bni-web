import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private gruposCollection: AngularFirestoreCollection<Usuario>;

  constructor(private afs: AngularFirestore) {
    this.gruposCollection = afs.collection<Usuario>('usuarios');
  }

  getUsuarioById(idUsuario: string): Observable<Usuario> {
    return this.gruposCollection.doc<Usuario>(idUsuario).valueChanges().pipe(map(document => {
      document.uid = idUsuario;
      return document;
    }));
  }
}