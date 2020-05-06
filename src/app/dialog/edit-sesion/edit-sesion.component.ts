import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sesion } from 'src/app/models/sesion';
import { MouseEvent } from '@agm/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-sesion',
  templateUrl: './edit-sesion.component.html',
  styleUrls: ['./edit-sesion.component.scss']
})
export class EditSesionComponent implements OnInit {

  sesion: Sesion;
  fechaForm: Date;
  minDate: Date = new Date();
  horaForm: string;
  showCoordenadas: boolean = false;
  zoom: number = 12;

  latPeru: number = -12.0431805;
  lngPeru: number = -77.0282364;

  latSesion: number;
  lngSesion: number;
  constructor(public dialogRef: MatDialogRef<EditSesionComponent>, @Inject(MAT_DIALOG_DATA) public data: { sesion: Sesion }) { }

  ngOnInit(): void {
    this.sesion = { ...this.data.sesion };
    this.latSesion = this.data.sesion.ubicacion.latitude;
    this.lngSesion = this.data.sesion.ubicacion.longitude;
    this.horaForm =  this.data.sesion.fechaHora.toDate().toLocaleTimeString();
    this.fechaForm = this.data.sesion.fechaHora.toDate();
  }
  editarSesion() {
    this.sesion.fechaHora = this.buildFechaHora();
    this.dialogRef.close({ sesion: this.sesion });
  }

  buildFechaHora(): firebase.firestore.Timestamp {
    return firebase.firestore.Timestamp.fromDate(this.setHourFechaInicio(this.horaForm, this.fechaForm));
  }

  setHourFechaInicio(horaSesion: string, fecha: Date) {
    let hora = Number(horaSesion.substring(0, 2));
    let minutos = Number(horaSesion.substring(3, 5))
    return new Date(fecha.setHours(hora, minutos, 0))
  }

  mapClicked($event: MouseEvent) {
    this.latSesion = $event.coords.lat;
    this.lngSesion = $event.coords.lng;
  }
  comfirmUbicacion() {
    this.sesion.ubicacion = new firebase.firestore.GeoPoint(this.latSesion, this.lngSesion);
    this.showCoordenadas = false;
  }
}
