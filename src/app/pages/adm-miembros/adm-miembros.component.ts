import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Miembro } from 'src/app/models/miembro';
import { SaveMiembroComponent } from 'src/app/dialog/save-miembro/save-miembro.component';
import { MatDialog } from '@angular/material/dialog';

import { MiembroService } from 'src/app/services/miembro.service';

@Component({
  selector: 'app-adm-miembros',
  templateUrl: './adm-miembros.component.html',
  styleUrls: ['./adm-miembros.component.scss']
})
export class AdmMiembrosComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'nombre', 'profesion', 'telefono', 'email', 'nombreCompania', 'acciones'];

  miembros: Miembro[]
  showFilters: boolean = true;
  constructor(private miembroService: MiembroService, private dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.miembroService.getMiembros().subscribe(
      miembros => {
        this.miembros = miembros;
        this.miembros.forEach(
          miembro =>
            this.miembroService.getAvatarImgUrl(miembro.idMiembro)
              .subscribe(avatarUrl => {
                miembro.avatarUrl = avatarUrl
              }));
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
              }, err =>this.snackBar.open(err, '', { duration: 2000 }));

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
}
