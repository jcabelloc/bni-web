import { Component, OnInit, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Miembro } from 'src/app/models/miembro';
import { SaveMiembroComponent } from 'src/app/dialog/save-miembro/save-miembro.component';
import { MatDialog } from '@angular/material/dialog';
import { MiembroService } from 'src/app/services/miembro.service';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo } from 'src/app/models/grupo';

interface Chip {
  key: string;
  value: string;
}

@Component({
  selector: 'app-adm-miembros',
  templateUrl: './adm-miembros.component.html',
  styleUrls: ['./adm-miembros.component.scss']
})
export class AdmMiembrosComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'nombre', 'profesion', 'estado', 'telefono', 'email', 'nombreEmpresa', 'grupo', 'acciones'];
  usuario: Usuario;
  miembrosConFiltros: Miembro[]
  miembro: Miembro;
  miembrosTotales: Miembro[]
  grupos: Grupo[];
  showFilters: boolean = false;
  filtros: Chip[] = new Array<Chip>();
  nombreFiltro: string;
  empresaFiltro: string;
  profesionFiltro: string;
  selectIdGrupo: string;
  disabledSelect: boolean;
  defaultProfile: string;
  constructor(private miembroService: MiembroService,
    private dialog: MatDialog, public snackBar: MatSnackBar,
    private authentication: AuthenticationService,
    private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.usuario = this.authentication.getUsuario();
    this.miembro = this.authentication.getMiembro();

    this.getDefaultProfile();
    this.getGrupos();
    if (this.usuario.esAdmin) {
      this.getMiembros();
    } else if (this.miembro.esAdmGrupo) {
      this.getMiembrosByIdGrupo();
      this.selectIdGrupo = this.miembro.idGrupo;
      this.disabledSelect = true;
    }

  }
  getMiembrosByIdGrupo() {
    this.miembroService.getMiembrosByIdGrupo(this.miembro.idGrupo).subscribe(
      miembros => {
        this.miembrosConFiltros = miembros;
        this.miembrosTotales = miembros;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  getDefaultProfile() {
    this.miembroService.getAvatarImgUrl(Miembro.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultProfile = avatarUrl;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  getGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  getMiembros() {
    this.miembroService.getMiembros().subscribe(
      miembros => {
        this.miembrosConFiltros = miembros;
        this.miembrosTotales = miembros;
      }
    );
  }

  addMiembro() {
    const dialogRef = this.dialog.open(SaveMiembroComponent, { width: '800px', data: { miembro: new Miembro(), opcion: "Nuevo" } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.miembro) {
        if (data?.imageFile) {
          this.miembroService.createMiembro(data.miembro).subscribe(
            idMiembro => {
              this.miembroService.uploadAvatar(idMiembro, data.imageFile).subscribe(
                () => {
                  data.miembro.idMiembro = idMiembro;
                  this.snackBar.open("Creado correctamente", '', { duration: 2000 });
                  this.getAvatarUrlMiembro(data.miembro);
                }, err => this.snackBar.open(err, '', { duration: 2000 }));
            },
            err => this.snackBar.open(err, '', { duration: 2000 }))
        } else {
          this.miembroService.createMiembro(data.miembro).subscribe(
            idMiembro => this.snackBar.open("Creado correctamente", '', { duration: 2000 })),
            err => this.snackBar.open(err, '', { duration: 2000 });
        }
      }
    });
  }

  getAvatarUrlMiembro(miembro: Miembro) {
    this.miembroService.getAvatarImgUrl(miembro.idMiembro).subscribe(
      avatarUrl => {
        miembro.avatarUrl = avatarUrl;
        this.miembroService.updateMiembro(miembro).subscribe(
          () => { },
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      },
      err => this.snackBar.open(err, '', { duration: 2000 }));
  }

  editMiembro(miembro: Miembro) {
    const dialogRef = this.dialog.open(SaveMiembroComponent, { width: '800px', data: { miembro: miembro, opcion: "Editar" } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.miembro) {
        if (data?.imageFile) {
          this.miembroService.uploadAvatar(miembro.idMiembro, data.imageFile).subscribe(
            () => {
              this.miembroService.updateMiembro(data.miembro).subscribe(
                () => {
                  this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 });
                  this.getAvatarUrlMiembro(data.miembro);
                },
                err => this.snackBar.open(err, '', { duration: 2000 }));
            },
            err => this.snackBar.open(err, '', { duration: 2000 }));
        }
        else {
          this.miembroService.updateMiembro(data.miembro).subscribe(
            () => {
              this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 });
            },
            err => this.snackBar.open(err, '', { duration: 2000 }));
        }
      }
    });
  }

  deleteMiembro(id: string) {
    this.miembroService.deleteMiembro(id);
  }

  // Filtros 

  filterMiembros() {
    let nombre = "Nombre";
    let empresa = "Empresa";
    let profesion = "Profesion";
    this.miembrosConFiltros = this.miembrosTotales;
    this.filterByIdGrupo();
    this.filtros.forEach(filtro => {
      switch (filtro.key) {
        case nombre:
          this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => {
            let nombreCompleto = miembro.nombres + " " + miembro.apellidos;
            if (nombreCompleto.toLowerCase().includes(filtro.value.toLowerCase())) {
              return true;
            }
          })
          break;
        case empresa:
          this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => miembro.nombreEmpresa.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
        case profesion:
          this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => miembro.profesion.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
      }
    });

  }
  filterByIdGrupo() {
    if (this.selectIdGrupo != null && this.selectIdGrupo != 'TODOS') {
      this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => miembro.idGrupo === this.selectIdGrupo);
    }
  }

  addFiltroNombre() {
    let indexFiltro = this.existFiltro("Nombre");
    if (indexFiltro == -1) {
      this.filtros.push({ key: "Nombre", value: this.nombreFiltro })
    } else {
      this.filtros[indexFiltro].value = this.nombreFiltro;
    }
    this.nombreFiltro = null;
    this.filterMiembros();
  }

  addFiltroEmpresa() {
    let indexFiltro = this.existFiltro("Empresa");
    if (indexFiltro == -1) {
      this.filtros.push({ key: "Empresa", value: this.empresaFiltro })
    } else {
      this.filtros[indexFiltro].value = this.empresaFiltro;
    }
    this.empresaFiltro = null;
    this.filterMiembros();

  }

  addFiltroProfesion() {
    let indexFiltro = this.existFiltro("Profesion");
    if (indexFiltro == -1) {
      this.filtros.push({ key: "Profesion", value: this.profesionFiltro })
    } else {
      this.filtros[indexFiltro].value = this.profesionFiltro;
    }
    this.profesionFiltro = null;
    this.filterMiembros();

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
    this.filterMiembros();
  }
}
