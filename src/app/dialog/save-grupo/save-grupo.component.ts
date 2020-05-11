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

  opcion: string;
  grupo: Grupo = new Grupo();
  diasSemana: DiasSemana[] = Grupo.diasSemana;
  showCoordenadas: boolean = false;
  showSpinner: boolean = false;
  selectedFile: File;
  defaultAvatar: any;
  zoom: number = 8;

  latPeru: number = -12.0431805;
  lngPeru: number = -77.0282364;

  latSesion: number;
  lngSesion: number;
  constructor(private snackBar: MatSnackBar,
              private grupoService: GrupoService,
              public dialogRef: MatDialogRef<SaveGrupoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { grupo: Grupo, opcion: string }) { }

  ngOnInit(): void {
    this.opcion = this.data.opcion;
    this.defaultAvatar = this.data.grupo.avatarUrl;
    if (this.data.grupo?.idGrupo) {
      this.grupo = {...this.data.grupo};
      this.latSesion = this.data.grupo.ubicacionSesion.latitude;
      this.lngSesion = this.data.grupo.ubicacionSesion.longitude;
    }
    if (this.data.grupo.avatarUrl == null) {
        this.setAvatarProfileDefault();
    }
  }

  agregarGrupo() {
    this.dialogRef.close({grupo: this.grupo, avatarFile: this.selectedFile});
  }

  mapClicked($event: MouseEvent) {
    this.latSesion = $event.coords.lat;
    this.lngSesion = $event.coords.lng;
  }
  comfirmUbicacion() {
    this.grupo.ubicacionSesion = new firebase.firestore.GeoPoint(this.latSesion,this.lngSesion);
    this.showCoordenadas = false;
  }

  onFileSelected(event: any) {

    const reader: FileReader = new FileReader();
    this.selectedFile = event.target.files[0] as File;
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (event) => {
      this.defaultAvatar = event.target.result;
    }
  }

  setAvatarProfileDefault() {
    this.showSpinner = true;
    this.grupoService.getAvatarImgUrl(Grupo.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatar = avatarUrl;
        this.showSpinner = false;
      },
      err => {
        this.snackBar.open("No se encontró la foto prederminada", '', { duration: 2000 });
        this.showSpinner = false;
      }
    );
  }
}
