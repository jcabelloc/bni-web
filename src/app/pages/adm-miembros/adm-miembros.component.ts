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

  displayedColumns: string[] = ['avatar', 'nombre', 'profesion', 'telefono', 'email', 'nombreCompania', 'acciones'];

  miembros: Miembro[]
  cloneMiembros: Miembro[]
  showFilters: boolean = false;
  filtros: Chip[] = new Array<Chip>();
  nombreFiltro: string;
  companiaFiltro: string;
  profesionFiltro: string;
  constructor(private miembroService: MiembroService, private dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.getMiembros();
  }
  getMiembros() {
    this.miembroService.getMiembros().subscribe(
      miembros => {
        this.miembros = miembros;
        this.miembros.forEach(
          miembro =>
            this.miembroService.getAvatarImgUrl(miembro.idMiembro)
              .subscribe(avatarUrl => {
                miembro.avatarUrl = avatarUrl
              }));
        this.cloneMiembros = this.miembros;
        this.filterMiembros();
      }
    );
  }
  addMiembro() {
    const dialogRef = this.dialog.open(SaveMiembroComponent, { width: '800px' });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.miembro) {
        this.miembroService.createMiembro(data.miembro).subscribe(
          idMiembro => {
            this.miembroService.uploadAvatar(idMiembro, data.imageFile).subscribe
              (() => {
                data.miembro.idMiembro = idMiembro;
                this.getAvatarUrlMiembro(data.miembro);
              }, err => this.snackBar.open(err, '', { duration: 2000 }));

          },
          err => this.snackBar.open(err, '', { duration: 2000 }))
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
    const dialogRef = this.dialog.open(SaveMiembroComponent, { width: '800px', data: { miembro: miembro } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.miembro) {
        this.miembroService.updateMiembro(miembro).subscribe(
          () => this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 }),
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      }
    });
  }

  deleteMiembro(id: string) {
    this.miembroService.deleteMiembro(id);
  }

  filterMiembros() {
    let nombre = "Nombre";
    let compania = "Compañia";
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
        case compania:
          this.miembros = this.miembros.filter(miembro => miembro.nombreCompania.toLowerCase().includes(filtro.value.toLowerCase()));
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

  addFiltroCompania() {
    let indexFiltro = this.existFiltro("Compañia");
    if (indexFiltro == -1) {
      this.filtros.push({ key: "Compañia", value: this.companiaFiltro })
    } else {
      this.filtros[indexFiltro].value = this.companiaFiltro;
    }
    this.companiaFiltro = null;
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
