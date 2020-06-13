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
  constructor(private snackBar: MatSnackBar,
              private grupoService: GrupoService,
              public dialogRef: MatDialogRef<SaveGrupoComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { grupo: Grupo, tituloOpcion: string }) { }

  ngOnInit(): void {

    this.grupo = {...this.data.grupo};

    this.defaultAvatar = this.grupo.avatarUrl;
    this.tituloOpcion = this.data.tituloOpcion;

    if(!this.defaultAvatar){
      this.updateDefaultAvatar();
    }

    if (this.grupo.idGrupo) {
      this.latSesion = this.grupo.ubicacionSesion.latitude;
      this.lngSesion = this.grupo.ubicacionSesion.longitude;
    }

  }

  createGrupo() {
    this.grupo.ubicacionSesion = new firebase.firestore.GeoPoint(this.latSesion,this.lngSesion);
    this.grupoService.createGrupo(this.grupo).subscribe(
      () => {
        this.snackBar.open("Creado correctamente", '', { duration: 2000 });
        this.dialogRef.close();
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
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
      this.grupo.avatarUrl = this.defaultAvatar;
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
        this.snackBar.open("No se encontró la foto prederminada", '', { duration: 2000 });
        this.showSpinner = false;
      }
    );
  }
}
