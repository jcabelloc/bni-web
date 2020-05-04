import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MiembroService } from 'src/app/services/miembro.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from 'src/app/models/asistencia';
import { Referencia } from 'src/app/models/referencia';

interface Chip {
  key: string;
  value: string;
}

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
  cloneAsistencias: Asistencia[];

  filtros: Chip[] = new Array<Chip>();
  referenciaFiltro: Referencia = new Referencia();
  nombreMiembroFiltro: string;
  fechaDesdeFiltro: Date;
  fechaHastaFiltro: Date;
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
        this.cloneAsistencias = asistencias;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  getAllAsistencias() {
    this.asistenciaService.getAsistencias().subscribe(
      asistencias => {
        this.asistencias = asistencias;
        this.cloneAsistencias = asistencias;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
  updateAsistenciaByIdGrupo() {

    if (this.selectIdGrupo == 'NONE') {
      this.getAllAsistencias();
      this.grupo = null;
    }
    else {
      this.getAsistenciasBytIdGrupo(this.selectIdGrupo);
      this.grupo = this.grupos.filter(grupo => grupo.idGrupo == this.selectIdGrupo)[0];
    }

  }

  mostrarOcultarDetalleGrupo() {
    if(this.usuario.esAdmin == true) {

    }
    else{

    }
  }

  getGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  addFiltro(tipoFiltro: string, value: any) {
    let indexFiltro = this.existFiltro(tipoFiltro);
    if (indexFiltro == -1) {
      this.filtros.push({ key: tipoFiltro, value: value })
    } else {
      this.filtros[indexFiltro].value = value;
    }
    this.filterAsistencia();
  }

  addFiltroNombreReferencia() {
    let tipoFiltro: string = "Nombre_Referencia";
    this.addFiltro(tipoFiltro, this.referenciaFiltro.nombre);
    this.referenciaFiltro.nombre = null;
  }
  addFiltroCargoReferencia() {

    let tipoFiltro: string = "Cargo_Referencia";
    this.addFiltro(tipoFiltro, this.referenciaFiltro.cargo);
    this.referenciaFiltro.cargo = null;
  }

  addFiltroEmpresaReferencia() {

    let tipoFiltro: string = "Empresa_Referencia";
    this.addFiltro(tipoFiltro, this.referenciaFiltro.empresa);
    this.referenciaFiltro.empresa = null;
  }
  addFiltroNombreMiembro() {

    let tipoFiltro: string = "Nombre_Miembro";
    this.addFiltro(tipoFiltro, this.nombreMiembroFiltro);
    this.nombreMiembroFiltro = null;
  }
  addFiltroFechaDesde() {
    let tipoFiltro: string = "Fecha_Desde";
    this.addFiltro(tipoFiltro, this.fechaDesdeFiltro.toDateString());
    this.fechaDesdeFiltro = null;

  }
  addFiltroFechaHasta() {
    let tipoFiltro: string = "Fecha_Hasta";
    this.addFiltro(tipoFiltro, this.fechaHastaFiltro.toDateString());
    this.fechaHastaFiltro = null;

  }

  existFiltro(tipo: string): number {
    let indexFiltro: number = -1;
    this.filtros.forEach((filtro, index) => {
      if (filtro.key === tipo) {
        indexFiltro = index
      }
    })
    return indexFiltro;
  }

  removeFilter(index: number) {
    this.filtros.splice(index, 1)
    if (this.filtros.length == 0) {
      this.asistencias = this.cloneAsistencias;
    }
    else {
      this.filterAsistencia();
    }
  }

  filterAsistencia() {
    let nombreReferencia: string = "Nombre_Referencia";
    let cargoReferencia: string = "Cargo_Referencia";
    let empresaReferencia: string = "Empresa_Referencia";;
    let nombreMiembro: string = "Nombre_Miembro";
    let fechaDesde: string = "Fecha_Desde";
    let fechaHasta: string = "Fecha_Hasta";

    this.asistencias = this.cloneAsistencias;
    this.filtros.forEach(filtro => {
      switch (filtro.key) {
        case nombreReferencia:
          this.asistencias = this.asistencias.filter(asistencia => {
            if (asistencia.referencia.nombre.toLowerCase().includes(filtro.value.toLowerCase())) {
              return true;
            }
          })
          break;
        case cargoReferencia:
          this.asistencias = this.asistencias.filter(asistencia => asistencia.referencia.cargo.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
        case empresaReferencia:
          this.asistencias = this.asistencias.filter(asistencia => asistencia.referencia.empresa.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
        case nombreMiembro:
          this.asistencias = this.asistencias.filter(asistencia => asistencia.nombreCompletoMiembro.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
        case fechaDesde:
          this.asistencias = this.asistencias.filter(asistencia => asistencia.fechaHora.toDate().getTime() >= new Date(filtro.value).getTime());
          break;
        case fechaHasta:
          this.asistencias = this.asistencias.filter(asistencia => asistencia.fechaHora.toDate().getTime() <= new Date(filtro.value).getTime());
          break;
      }
    });
  }

}
