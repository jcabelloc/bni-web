import { Component, OnInit } from '@angular/core';
import { SaveGrupoComponent } from 'src/app/dialog/save-grupo/save-grupo.component';
import { MatDialog } from '@angular/material/dialog';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adm-grupos',
  templateUrl: './adm-grupos.component.html',
  styleUrls: ['./adm-grupos.component.scss']
})
export class AdmGruposComponent implements OnInit {

  grupos: Grupo[];
  displayedColumns: string[] = ['nombre', 'diaSesion', 'direccionSesion', 'lugarSesion', 'horaSesion','acciones'];

  constructor(private dialog: MatDialog, private grupoService: GrupoService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getGrupos();
  }

  getGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  addGrupo() {
    const dialogRef = this.dialog.open(SaveGrupoComponent, { width: '800px', data: { grupo: new Grupo(), opcion: "Nuevo" } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.grupo) {
        this.grupoService.createGrupo(data?.grupo).subscribe(
          () => { this.snackBar.open("Se guardó correctamente", '', { duration: 2000 }) },
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      }
    });
  }

  editGrupo(grupo: Grupo) {
    const dialogRef = this.dialog.open(SaveGrupoComponent, { width: '800px', data: { grupo: grupo, opcion: "Editar" } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.grupo) {
        this.grupoService.updateGrupo(data?.grupo).subscribe(
          () => this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 }),
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      }
    });
  }

  deleteGrupo(idGrupo: string) {
    this.grupoService.deleteGrupo(idGrupo).subscribe(
      () => this.snackBar.open("Se eliminó correctamente", '', { duration: 2000 }),
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
}
