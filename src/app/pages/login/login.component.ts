import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: string = "jcabelloc"
  contraseña: string = "123456"
  usuarioForm: string = ""
  contraseniaForm: string = ""
  progressSnipper = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  logIn() {
    this.progressSnipper = true;
    setTimeout(() => {
      this.progressSnipper = false;
      if (this.usuarioForm === this.usuario && this.contraseña === this.contraseniaForm) {
         //TO-DO
      }
    }, 3000);
  }
}
