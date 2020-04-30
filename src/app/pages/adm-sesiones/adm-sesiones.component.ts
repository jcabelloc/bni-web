import { Component, OnInit } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo } from 'src/app/models/grupo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GenerarSesionesComponent } from 'src/app/dialog/generar-sesiones/generar-sesiones.component';
import { SesionService } from 'src/app/services/sesion.service';
import { Sesion } from 'src/app/models/sesion';
import { EditSesionComponent } from 'src/app/dialog/edit-sesion/edit-sesion.component';

@Component({
  selector: 'app-adm-sesiones',
  templateUrl: './adm-sesiones.component.html',
  styleUrls: ['./adm-sesiones.component.scss']
})
export class AdmSesionesComponent implements OnInit {

  idGrupo: string = 'btJ5XSkYP9lwqZPJxJnj';
  grupo: Grupo = new Grupo();
  sesiones: Sesion[];
  sesionesDataTable: Sesion[];
  yearFilter: number;
  selectYear: number[] = Array<number>();
  displayedColumns: string[] = ['fecha', 'horaSesion', 'direccionSesion', 'lugarSesion', 'ubicacionSesion', 'acciones'];
  fechaActual: Date = new Date();
  constructor(private grupoService: GrupoService, private sesionService: SesionService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getGrupo();
    this.getSesionesByIdGrupoAndAscendingByFechaHora();
  }

  getGrupo() {
    this.grupoService.findById(this.idGrupo).subscribe(
      grupo => { this.grupo = grupo },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  editSesion(sesion: Sesion) {
    const dialogRef = this.dialog.open(EditSesionComponent, { width: '800px', data: { sesion: sesion } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.sesion) {
        this.sesionService.updateSesion(data?.sesion).subscribe(
          () => {
            this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 }),
            this.updateSesionesDataTable();
          },
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      }
    });

  }

  updateSesionesDataTable() {
    this.sesionesDataTable = this.sesiones.filter(sesion => sesion.fechaHora.toDate().getFullYear() == this.yearFilter);
    this.sesionesDataTable = [].concat(this.sesionesDataTable);

  }

  generateSesions() {
    const dialogRef = this.dialog.open(GenerarSesionesComponent, { width: '800px', data: { grupo: this.grupo } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.sesiones) {
        this.sesionService.createSesiones(data.sesiones).subscribe(
          () => {
            this.grupoService.updateGrupo(data?.grupo).subscribe(
              () => this.snackBar.open("Se gabraron correctamente las sesiones", '', { duration: 2000 }),
              err => this.snackBar.open(err, '', { duration: 2000 }));
          }, err => this.snackBar.open(err, '', { duration: 2000 }));
      }
    });
  }
  getSesionesByIdGrupoAndAscendingByFechaHora() {
    this.sesionService.getSesionesByIdGrupoAndAscendingByFechaHora(this.idGrupo).subscribe(
      sesiones => {
        this.sesiones = sesiones;
        this.generateSelectYears();
      },
      err => this.snackBar.open(err, '', { duration: 2000 }))
  }

  generateSelectYears() {
    let initYear = this.sesiones[0].fechaHora.toDate().getFullYear();
    while (initYear <= this.grupo.ultimaGeneracion) {
      this.selectYear.push(initYear);
      initYear++;
    }
  }
  getValidacionFechaPasada(sesion: Sesion): boolean {
    if (sesion.fechaHora.toDate() < this.fechaActual) {
      return true;
    }
  }
}
