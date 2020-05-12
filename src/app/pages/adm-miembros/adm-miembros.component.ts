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
import { DeleteMiembroComponent } from 'src/app/dialog/delete-miembro/delete-miembro.component';

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
  filtrosSeleccionados: Map<string, string> = new Map();
  selectIdGrupo: string;
  disabledSelect: boolean;
  defaultAvatarUrl: string;
  constructor(private miembroService: MiembroService,
    private dialog: MatDialog, public snackBar: MatSnackBar,
    private authentication: AuthenticationService,
    private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.usuario = this.authentication.getUsuario();
    this.miembro = this.authentication.getMiembro();

    this.setDefaultAvatarUrl();
    this.setGrupos();
    if (this.usuario.esAdmin) {
      this.miembroService.getMiembros().subscribe(
        miembros => {
          this.miembrosConFiltros = miembros;
          this.miembrosTotales = miembros;
        },
        err => this.snackBar.open(err, '', { duration: 2000 })
      );
    } else if (this.miembro.esAdmGrupo) {
      this.miembroService.getMiembrosByIdGrupo(this.miembro.idGrupo).subscribe(
        miembros => {
          this.miembrosConFiltros = miembros;
          this.miembrosTotales = miembros;
        },
        err => this.snackBar.open(err, '', { duration: 2000 })
      );
      this.selectIdGrupo = this.miembro.idGrupo;
      this.disabledSelect = true;
    }

  }

  setDefaultAvatarUrl(): void {
    this.miembroService.getAvatarImgUrl(Miembro.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatarUrl = avatarUrl;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  setGrupos(): void {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
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

  deleteMiembro(miembro: Miembro) {
    const dialogRef = this.dialog.open(DeleteMiembroComponent, { width: '800px', data: { miembro: miembro } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.existeHistorialMiembro == false) {
        this.miembroService.deleteMiembro(miembro.idMiembro).subscribe(
          () => this.snackBar.open("Se eliminó correctamente", '', { duration: 2000 }),
          err => this.snackBar.open(err, '', { duration: 2000 }));
      }
      else if (data?.existeHistorialMiembro) {
        this.snackBar.open("El miembro tiene historial, no se puede eliminar", '', { duration: 2000 });
      }
    });
  }

  // Filtros 
  filterMiembros() {
    this.miembrosConFiltros = this.miembrosTotales;
    this.filterMiembrosByIdGrupo();
    this.filtrosSeleccionados.forEach( (value , key) => {
      switch (key) {
        case 'Nombre':
          this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => {
            let nombreCompleto = miembro.nombres + " " + miembro.apellidos;
            return nombreCompleto.toLowerCase().includes(value.toLowerCase());
          })
          break;
        case 'Empresa':
          this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => miembro.nombreEmpresa.toLowerCase().includes(value.toLowerCase()));
          break;
        case 'Profesion':
          this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => miembro.profesion.toLowerCase().includes(value.toLowerCase()));
          break;
      }
    })
  }

  filterMiembrosByIdGrupo() {
    if (this.selectIdGrupo != null && this.selectIdGrupo != 'TODOS') {
      this.miembrosConFiltros = this.miembrosConFiltros.filter(miembro => miembro.idGrupo === this.selectIdGrupo);
    }
  }

  addFiltro(criterioFiltro: string, event: any) {
    this.filtrosSeleccionados.set(criterioFiltro,event.target.value);
    event.target.value = '';
    this.filterMiembros();
  }

  removeFilter(criterioFiltro: string) {
    this.filtrosSeleccionados.delete(criterioFiltro);
    this.filterMiembros();
  }
}
