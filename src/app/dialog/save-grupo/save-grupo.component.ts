import { Component, OnInit, Inject } from '@angular/core';
import { Grupo, DiasSemana } from 'src/app/models/grupo';
import { MouseEvent } from '@agm/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as firebase from 'firebase';

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
  zoom: number = 8;

  latPeru: number = -12.0431805;
  lngPeru: number = -77.0282364;

  latSesion: number;
  lngSesion: number;
  constructor(public dialogRef: MatDialogRef<SaveGrupoComponent>, @Inject(MAT_DIALOG_DATA) public data: { grupo: Grupo, opcion: string }) { }

  ngOnInit(): void {
    this.opcion = this.data.opcion;
    if (this.data.grupo?.idGrupo) {
      this.grupo = {...this.data.grupo};
      this.latSesion = this.data.grupo.ubicacionSesion.latitude;
      this.lngSesion = this.data.grupo.ubicacionSesion.longitude;
    }
  }

  agregarGrupo() {
    this.dialogRef.close({grupo: this.grupo});
  }

  mapClicked($event: MouseEvent) {
    this.latSesion = $event.coords.lat;
    this.lngSesion = $event.coords.lng;
  }
  comfirmUbicacion() {
    this.grupo.ubicacionSesion = new firebase.firestore.GeoPoint(this.latSesion,this.lngSesion);
    this.showCoordenadas = false;
  }
}
