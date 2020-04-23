import { Component, OnInit } from '@angular/core';
import { MatSnackBarConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Miembro } from 'src/app/models/miembro';
import { SaveMiembroComponent } from 'src/app/dialog/save-miembro/save-miembro.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-adm-miembros',
  templateUrl: './adm-miembros.component.html',
  styleUrls: ['./adm-miembros.component.scss']
})
export class AdmMiembrosComponent implements OnInit {

  displayedColumns: string[] = ['foto', 'nombre', 'profesion', 'telefono', 'email', 'nombreCompania', 'acciones'];
  dataSource = [];

  constructor (private dialog:MatDialog,public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  addMiembro() {

    const dialogRef = this.dialog.open(SaveMiembroComponent, { width: '800px' });
    dialogRef.afterClosed().subscribe(miembro => {
      if (miembro) {
        this.dataSource.push(miembro);
        this.dataSource = [].concat(this.dataSource);
      }
    });
  }
}
