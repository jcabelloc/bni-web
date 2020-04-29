import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Sesion } from '../models/sesion';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private sesionesCollection: AngularFirestoreCollection<Sesion>;

  constructor(private afs: AngularFirestore) {
    this.sesionesCollection = afs.collection<Sesion>('sesiones');
  }


  createSesiones(sesiones: Sesion[]): Observable<void> {
    let sesionRef;
    let idSesion: string;
    const batch = this.afs.firestore.batch();
    sesiones.forEach(sesion => {
      idSesion = this.afs.createId();
      sesionRef = this.sesionesCollection.doc(idSesion); 
      batch.set(sesionRef.ref,{... sesion})
      
    });

    return from(batch.commit().then().catch())
  }

}
