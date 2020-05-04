import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MiembroService } from 'src/app/services/miembro.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from 'src/app/models/asistencia';

@Component({
  selector: 'app-consultar-referencia',
  templateUrl: './consultar-referencia.component.html',
  styleUrls: ['./consultar-referencia.component.scss']
})
export class ConsultarReferenciaComponent implements OnInit {

  idUsuario: string = "V0HGm0EeHaPlGyxZ3d4c2fl5do23";
  showFilters: boolean = false;
  displayedColumns: string[] = ['nombreReferencia', 'cargoReferencia', 'empresaReferencia', 'fechaSesion', 'nombreMiembro', 'nombreGrupo'];
  grupos: Grupo[];
  grupo: Grupo;
  usuario: Usuario;
  selectIdGrupo: string;
  asistencias: Asistencia[];

  constructor(private asistenciaService: AsistenciaService, private usuarioService: UsuarioService, private grupoService: GrupoService, private snackBar: MatSnackBar, private miembroService: MiembroService) { }

  ngOnInit(): void {
    this.getGrupos();
    this.getUsuarioById();
  }

  getUsuarioById() {
    this.usuarioService.getUsuarioById(this.idUsuario).subscribe(
      usuario => {
        this.usuario = usuario;
        if (!usuario.esAdmin) {
          this.miembroService.getMiembroById(usuario.idMiembro).subscribe(
            miembro => {
              this.selectIdGrupo = miembro.idGrupo;
              this.updateAsistenciaByIdGrupo();
            },
            err => this.snackBar.open(err, '', { duration: 2000 })
          );
        }
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );

  }
  getAsistenciasBytIdGrupo(idGrupo: string) {
    this.asistenciaService.getAsistenciasByIdGrupo(idGrupo).subscribe(
      asistencias => {
        this.asistencias = asistencias;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  getAllAsistencias() {
    this.asistenciaService.getAsistencias().subscribe(
      asistencias => { this.asistencias = asistencias },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
  updateAsistenciaByIdGrupo() {

    if (this.selectIdGrupo == 'NONE') {
      this.getAllAsistencias();
    }
    else {
      this.getAsistenciasBytIdGrupo(this.selectIdGrupo);
      this.grupo = this.grupos.filter(grupo => grupo.idGrupo == this.selectIdGrupo)[0];
    }

  }

  getGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

}
