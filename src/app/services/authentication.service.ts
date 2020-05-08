import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Usuario } from '../models/usuario';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private usuario: Usuario;
  constructor(private auth: AngularFireAuth, private usuarioService: UsuarioService) { }

  logIn(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  logOut(): Observable<void> {
    return from(this.auth.signOut());
  }

  saveCredentials(usuario: Usuario): void {
    this.usuario = usuario;
  }
  getCredential(): Usuario {
    return this.usuario;
  }
}
