import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Opcion } from 'src/app/models/opcion';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  opciones: Opcion[] = [
    {
      nombre: 'Gestion',
      opciones: [
        { nombre: 'Miembros', ruta: '/main/miembros' },
        { nombre: 'Grupos', ruta: '/main/grupos' },
        { nombre: 'Sesiones', ruta: '/main/sesiones' },
        { nombre: 'Referencias', ruta: '/main/referencias' }
      ]
    },

  ];

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private authentication: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  logOut() {
    this.authentication.logOut().subscribe(
      () => {
        this.router.navigate(["seguridad/login"]);
      },
      err => this.snackBar.open(err, '', { duration: 2000 }));
  }
}
