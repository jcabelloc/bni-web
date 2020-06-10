import { Component, OnInit } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo } from 'src/app/models/grupo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GenerarSesionesComponent } from 'src/app/dialog/generar-sesiones/generar-sesiones.component';
import { SesionService } from 'src/app/services/sesion.service';
import { Sesion } from 'src/app/models/sesion';
import { EditSesionComponent } from 'src/app/dialog/edit-sesion/edit-sesion.component';
import { Miembro } from 'src/app/models/miembro';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-adm-sesiones',
  templateUrl: './adm-sesiones.component.html',
  styleUrls: ['./adm-sesiones.component.scss']
})
export class AdmSesionesComponent implements OnInit {

  miembro: Miembro;
  usuario: Usuario;
  disabledSelect: boolean = false;
  idGrupoSeleccionado: string;
  grupo: Grupo;
  grupos: Grupo[];
  sesiones: Sesion[];
  sesionesDataTable: Sesion[];
  yearFilter: number;
  selectYear: number[] = Array<number>();
  displayedColumns: string[] = ['numeroSesion', 'fecha', 'horaSesion', 'direccionSesion', 'lugarSesion', 'ubicacionSesion', 'acciones'];
  fechaActual: Date = new Date();
  constructor(private authentication: AuthenticationService,
              private grupoService: GrupoService, 
              private sesionService: SesionService, 
              private snackBar: MatSnackBar, 
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.miembro = this.authentication.getMiembro();
    this.usuario = this.authentication.getUsuario();
    if(this.usuario.esAdmin){
      this.setGrupos();
    }else if(this.miembro.esAdmGrupo) {
      this.grupoService.findById(this.miembro.idGrupo).subscribe(
        grupo => {
          this.grupo = grupo;
          this.grupos = [].concat(grupo);        
        },
        err =>this.snackBar.open(err, '', { duration: 2000 })
      );
      this.getSesionesByIdGrupoAndAscendingByFechaHora(this.miembro.idGrupo);
      this.idGrupoSeleccionado = this.miembro.idGrupo;
      this.disabledSelect = true;
    }
  
  }

  setGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { 
        this.grupos = grupos 
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  editSesion(sesion: Sesion) {
    const dialogRef = this.dialog.open(EditSesionComponent, { width: '800px', data: { sesion: sesion} });
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

    let fechaInicial = new Date();
    fechaInicial.setFullYear(this.yearFilter);
    fechaInicial.setMonth(0);
    fechaInicial.setDate(0);
    
    let fechaFinal = new Date();
    fechaFinal.setFullYear(this.yearFilter);
    fechaFinal.setMonth(11);
    fechaFinal.setDate(31);

    this.sesionesDataTable = this.sesiones.filter(sesion => sesion.fechaHora.toDate() >= fechaInicial && sesion.fechaHora.toDate() <= fechaFinal );
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
  getSesionesByIdGrupoAndAscendingByFechaHora(idGrupo: string) {
    this.sesionService.getSesionesByIdGrupoAndAscendingByFechaHora(idGrupo).subscribe(
      sesiones => {
        this.sesiones = sesiones;
        this.generateSelectYears();
      },
      err => this.snackBar.open(err, '', { duration: 2000 }))
  }

  generateSelectYears() {
    this.selectYear = [];
    let initYear = this.sesiones[0]?.fechaHora.toDate().getFullYear();
    while (initYear <= this.grupo.ultimaGeneracion + 1) {
      this.selectYear.push(initYear);
      initYear++;
    }
  }
  getValidacionFechaPasada(sesion: Sesion): boolean {
    if (sesion.fechaHora.toDate() < this.fechaActual) {
      return true;
    }
  }

  deleteSesion(idSesion: string) {
    this.sesionService.deleteSesion(idSesion).subscribe(
      () => {
        this.snackBar.open("Se eliminó correctamente", '', { duration: 2000 });
        this.updateSesionesDataTable();
      },
      err => this.snackBar.open(err, '', { duration: 2000 }));
  }

  filterSesiones()
  {
    this.getSesionesByIdGrupoAndAscendingByFechaHora(this.idGrupoSeleccionado);
    this.updateGrupo();
    this.yearFilter = null;
    this.sesionesDataTable = [].concat([]);
  }

  updateGrupo() {
    if (this.idGrupoSeleccionado != null ) {
      this.grupo = this.grupos.filter(grupo => grupo.idGrupo === this.idGrupoSeleccionado)[0];
    }
  }
}
