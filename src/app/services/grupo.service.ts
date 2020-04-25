import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { AngularFirestore } from '@angular/fire/firestore';
import { Grupo } from '../models/grupo';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private gruposCollection: AngularFirestoreCollection<Grupo>;

  constructor(private afs: AngularFirestore) {
    this.gruposCollection = afs.collection<Grupo>('grupos');
  }

  createGrupo(grupo: Grupo): Observable<string> {

    let idGrupo: Observable<string>;
    idGrupo = from(this.gruposCollection.add({... grupo})).pipe(map(document => document.id));
    return idGrupo;
  }
}
