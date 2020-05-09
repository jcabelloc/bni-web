import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Usuario } from '../models/usuario';
import { UsuarioService } from './usuario.service';
import { Miembro } from '../models/miembro';
import { MiembroService } from './miembro.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private usuario: Usuario;
  private miembro: Miembro;
  constructor(private auth: AngularFireAuth, private usuarioService: UsuarioService, private miembroService: MiembroService) { }

  logIn(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.auth.signInWithEmailAndPassword(email, password));
  }

  logOut(): Observable<void> {
    this.usuario = null;
    return from(this.auth.signOut());
  }

  saveUsuario(usuario: Usuario): void {
    this.usuario = usuario;
  }

  saveMiembro(miembro: Miembro): void {
    this.miembro = miembro;
  }

  getUsuario(): Usuario {
    return this.usuario;
  }

  getMiembro(): Miembro
  {
    return this.miembro;
  }

  initializeUsuario(): Promise<void> {
    const bind = this;
    return new Promise(function (resolve, reject) {
      bind.auth.user.subscribe(
        user =>  bind.usuarioService.getUsuarioById(user.uid).subscribe(
          usuario => {
            bind.miembroService.getMiembroById(usuario.idMiembro).subscribe(
              miembro =>{
                bind.saveUsuario(usuario);
                bind.saveMiembro(miembro);
                resolve();
              }
            ) 
          },
          err => reject(Error("No se pudo encontrar el usuario"))
        ) 
      );
      resolve();
    });
  }
}
