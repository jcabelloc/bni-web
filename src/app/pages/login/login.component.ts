import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MiembroService } from 'src/app/services/miembro.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  email: string;
  password: string;
  progressSnipper = false;
  constructor(private router: Router, private authentication: AuthenticationService, private snackBar: MatSnackBar, 
    private usuarioService: UsuarioService,
    private miembroService: MiembroService) { }

  ngOnInit(): void {
  }

  logIn() {
    this.progressSnipper = true;
    this.authentication.logIn(this.email, this.password).subscribe(
      userCredential => {
        if (userCredential.user.uid != null) {
          this.usuarioService.getUsuarioById(userCredential.user.uid).subscribe(
            usuario => {
              this.miembroService.getMiembroById(usuario.idMiembro).subscribe(
                miembro => {
                  this.authentication.saveUsuario(usuario);
                  this.authentication.saveMiembro(miembro);
                  this.router.navigate(["main"])
                },
                err =>this.snackBar.open(err, '', { duration: 2000 }));
            },
            err => {
              this.progressSnipper = false;
              this.snackBar.open("No se pudo obtener el usuario", '', { duration: 2000 });
            }
          );
        }
      },
      err => {
        this.progressSnipper = false;
        this.snackBar.open("Contraseña o email incorrectos", '', { duration: 2000 });

      });
  }
}
