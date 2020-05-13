import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from 'src/app/models/asistencia';
import { Miembro } from 'src/app/models/miembro';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-consultar-referencia',
  templateUrl: './consultar-referencia.component.html',
  styleUrls: ['./consultar-referencia.component.scss']
})
export class ConsultarReferenciaComponent implements OnInit {

  showFilters: boolean = false;
  displayedColumns: string[] = ['nombreReferencia', 'cargoReferencia', 'empresaReferencia', 'fechaSesion', 'nombreMiembro', 'nombreGrupo'];
  grupos: Grupo[];
  grupo: Grupo;
  usuario: Usuario;
  miembro: Miembro;
  selectIdGrupo: string;
  asistenciasConFiltros: Asistencia[];
  asistenciasTotales: Asistencia[];

  filtrosSeleccionados: Map<string, string> = new Map();

  constructor(private asistenciaService: AsistenciaService, private authentication: AuthenticationService, private grupoService: GrupoService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.usuario = this.authentication.getUsuario();
    this.miembro = this.authentication.getMiembro();
    if (this.usuario.esAdmin) {
      this.setAllAsistencias();
    } else if (this.miembro.esAdmGrupo) {
      this.selectIdGrupo = this.miembro.idGrupo;
      this.setAsistenciasBytIdGrupo(this.selectIdGrupo);
    }
    this.setGrupos();
  }

  setAsistenciasBytIdGrupo(idGrupo: string) {
    this.asistenciaService.getAsistenciasByIdGrupo(idGrupo).subscribe(
      asistencias => {
        this.asistenciasConFiltros = asistencias;
        this.asistenciasTotales = asistencias;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  setAllAsistencias() {
    this.asistenciaService.getAsistencias().subscribe(
      asistencias => {
        this.asistenciasConFiltros = asistencias;
        this.asistenciasTotales = asistencias;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  setGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => {
        this.grupos = grupos;
        this.grupo = this.grupos.filter(grupo => grupo.idGrupo == this.selectIdGrupo)[0];
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }


  addFiltro(criterioFiltro: string, event: any) {
    if (criterioFiltro === 'Fecha_Hasta' || criterioFiltro === 'Fecha_Desde') {
      this.filtrosSeleccionados.set(criterioFiltro, event.target.value.toDateString());
    } else {
      this.filtrosSeleccionados.set(criterioFiltro, event.target.value);
    }
    event.target.value = '';
    this.filterAsistencia();
  }

  removeFilter(criterioFiltro: string) {
    this.filtrosSeleccionados.delete(criterioFiltro);
    this.filterAsistencia();
  }

  filterAsistenciasByIdGrupo() {
    if (this.selectIdGrupo != null && this.selectIdGrupo != 'TODOS') {
      this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => asistencia.idGrupo === this.selectIdGrupo);
    }
    this.grupo = this.grupos.filter(grupo => grupo.idGrupo == this.selectIdGrupo)[0];
  }
  filterAsistencia() {
    this.asistenciasConFiltros = this.asistenciasTotales;
    this.filterAsistenciasByIdGrupo();
    this.filtrosSeleccionados.forEach((value, key) => {
      switch (key) {
        case 'Nombre_Referencia':
          this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => {
            return asistencia.referencia.nombre.toLowerCase().includes(value.toLowerCase())
          })
          break;
        case 'Cargo_Referencia':
          this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => asistencia.referencia.cargo.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'Empresa_Referencia':
          this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => asistencia.referencia.empresa.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'Nombre_Miembro':
          this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => asistencia.nombreCompletoMiembro.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'Fecha_Desde':
          this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => asistencia.fechaHora.toDate().getTime() >= new Date(value).getTime());
          break;
        case 'Fecha_Hasta':
          this.asistenciasConFiltros = this.asistenciasConFiltros.filter(asistencia => asistencia.fechaHora.toDate().getTime() <= new Date(value).getTime());
          break;
      }
    });
  }

}
