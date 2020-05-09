import { Component, OnInit, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Miembro } from 'src/app/models/miembro';
import { SaveMiembroComponent } from 'src/app/dialog/save-miembro/save-miembro.component';
import { MatDialog } from '@angular/material/dialog';
import { MiembroService } from 'src/app/services/miembro.service';

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

  displayedColumns: string[] = ['avatar', 'nombre', 'profesion', 'telefono', 'email', 'nombreEmpresa', 'grupo', 'acciones'];
  miembros: Miembro[]
  cloneMiembros: Miembro[]
  showFilters: boolean = false;
  filtros: Chip[] = new Array<Chip>();
  nombreFiltro: string;
  empresaFiltro: string;
  profesionFiltro: string;
  constructor(private miembroService: MiembroService, private dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.getMiembros();
  }
  getMiembros() {
    this.miembroService.getMiembros().subscribe(
      miembros => {
        this.miembros = miembros;
        this.cloneMiembros = miembros;
        this.filterMiembros();
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
    this.miembros = this.cloneMiembros;
    this.filtros.forEach(filtro => {
      switch (filtro.key) {
        case nombre:
          this.miembros = this.miembros.filter(miembro => {
            let nombreCompleto = miembro.nombres + " " + miembro.apellidos;
            if (nombreCompleto.toLowerCase().includes(filtro.value.toLowerCase())) {
              return true;
            }
          })
          break;
        case empresa:
          this.miembros = this.miembros.filter(miembro => miembro.nombreEmpresa.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
        case profesion:
          this.miembros = this.miembros.filter(miembro => miembro.profesion.toLowerCase().includes(filtro.value.toLowerCase()));
          break;
      }
    });
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
    if (this.filtros.length == 0) {
      this.miembros = this.cloneMiembros;
    }
    else {
      this.filterMiembros();
    }
  }
}
