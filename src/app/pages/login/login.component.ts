import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  email: string;
  password: string;
  progressSnipper = false;
  constructor(private router: Router, private authentication: AuthenticationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  logIn() {
    this.progressSnipper = true;
    this.authentication.logIn(this.email, this.password).subscribe(
      userCredential => {
        if (userCredential.user.uid != null) {
          this.router.navigate(["main"]);
        }
      },
      err => {
        this.progressSnipper = false;
        this.snackBar.open("Contraseña o email incorrectos", '', { duration: 2000 });

      });
  }
}
