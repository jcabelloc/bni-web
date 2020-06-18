import { Component, OnInit, Inject } from '@angular/core';
import { Grupo, DiasSemana } from 'src/app/models/grupo';
import { MouseEvent } from '@agm/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as firebase from 'firebase';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-grupo',
  templateUrl: './save-grupo.component.html',
  styleUrls: ['./save-grupo.component.scss']
})
export class SaveGrupoComponent implements OnInit {

  tituloOpcion: string;
  grupo: Grupo = new Grupo();

  diasSemana: DiasSemana[] = Grupo.diasSemana;
  showCoordenadas: boolean = false;

  showSpinner: boolean = false;
  selectedAvatar: File;
  defaultAvatar: any;
  zoom: number = 8;

  latPeru: number = -12.0431805;
  lngPeru: number = -77.0282364;

  latSesion: number;
  lngSesion: number;

  editarGrupo: boolean;
  estaPresionado: boolean = false;
  constructor(private snackBar: MatSnackBar,
              private grupoService: GrupoService,
              public dialogRef: MatDialogRef<SaveGrupoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { grupo: Grupo, tituloOpcion: string, editar: boolean }) { }

  ngOnInit(): void {

    this.grupo = {...this.data.grupo};
    this.editarGrupo = false;

    this.defaultAvatar = this.grupo.avatarUrl;
    this.tituloOpcion = this.data.tituloOpcion;

    if(this.data?.editar){
      this.editarGrupo = true;
    }

    if(!this.defaultAvatar){
      this.updateDefaultAvatar();
    }

    if (this.grupo.idGrupo) {
      this.latSesion = this.grupo.ubicacionSesion.latitude;
      this.lngSesion = this.grupo.ubicacionSesion.longitude;
    }

  }

  createGrupo() {
    this.estaPresionado = true;
    if (this.estaPresionado) {
      this.grupo.ubicacionSesion = new firebase.firestore.GeoPoint(this.latSesion,this.lngSesion);
      this.grupoService.createGrupo(this.grupo).subscribe(
        idGrupo => {
          if (this.selectedAvatar) {
            this.grupo.idGrupo = idGrupo;
            this.grupoService.uploadAvatar(idGrupo, this.selectedAvatar).subscribe(
              () => this.updateUrlAvatarGrupo(this.grupo),
              err => this.snackBar.open(err, '', { duration: 2000})
            );
          } else {
            this.snackBar.open("Creado correctamente", '', { duration: 2000 });
            this.dialogRef.close();
          }
        },
        err => this.snackBar.open(err, '', { duration: 2000 })
      );
    }
  }

  updateGrupo(){
    this.estaPresionado = true;
    if (this.estaPresionado) {
      if (this.selectedAvatar) {
        this.grupoService.uploadAvatar(this.grupo.idGrupo, this.selectedAvatar).subscribe(
          () => this.updateUrlAvatarGrupo(this.grupo),
          err => this.snackBar.open(err, '', { duration: 2000 }) 
        );
      } else {
        this.grupoService.updateGrupo(this.grupo).subscribe(
          () => {
            this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 });
            this.dialogRef.close();
          }
        );
      }
    }
  }

  updateUrlAvatarGrupo(grupo: Grupo){
    this.grupoService.getAvatarImgUrl(grupo.idGrupo).subscribe(
      avatarUrl => {
        grupo.avatarUrl = avatarUrl;
        this.grupoService.updateGrupo(grupo).subscribe(
          () => { 
            if (this.editarGrupo) {
              this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 });
            } else {
              this.snackBar.open("Creado correctamente", '', { duration: 2000 });
            }
            this.dialogRef.close();
          },
          err => this.snackBar.open(err, 'Error al actualizar grupo', { duration: 2000 })
        );
      },
      err => this.snackBar.open(err, 'No se encontró el avatar del grupo', { duration: 2000 })
    ); 
  }

  mapClicked($event: MouseEvent) {
    this.latSesion = $event.coords.lat;
    this.lngSesion = $event.coords.lng;
  }

  comfirmUbicacion() {
    this.grupo.ubicacionSesion = new firebase.firestore.GeoPoint(this.latSesion,this.lngSesion);
    this.showCoordenadas = false;
  }

  onAvatarSelected(event: any) {
    const reader: FileReader = new FileReader();
    this.selectedAvatar = event.target.files[0] as File;
    reader.readAsDataURL(this.selectedAvatar);
    reader.onload = (event) => {
      this.defaultAvatar = event.target.result;
    }
  }

  updateDefaultAvatar() {
    this.showSpinner = true;
    this.grupoService.getAvatarImgUrl(Grupo.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatar = avatarUrl;
        this.showSpinner = false;
      },
      err => {
        this.snackBar.open("No se encontró la foto predeterminada", '', { duration: 2000 });
        this.showSpinner = false;
      }
    );
  }
}
