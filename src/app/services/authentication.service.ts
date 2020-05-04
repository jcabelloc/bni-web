import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private auth: AngularFireAuth) { }

  logIn(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  logOut(): Observable<void> {
    return from(this.auth.signOut());
  }
}
