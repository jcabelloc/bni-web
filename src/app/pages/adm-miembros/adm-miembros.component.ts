import { Component, OnInit } from '@angular/core';
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Miembro } from 'src/app/models/miembro';


@Component({
  selector: 'app-adm-miembros',
  templateUrl: './adm-miembros.component.html',
  styleUrls: ['./adm-miembros.component.scss']
})
export class AdmMiembrosComponent implements OnInit {

  displayedColumns: string[] = ['foto', 'nombre', 'profesion', 'telefono', 'correo', 'nombreCompania', 'acciones'];
  dataSource = [];

  constructor (public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
