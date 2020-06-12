import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Sesion } from '../../models/sesion';
import { Grupo } from 'src/app/models/grupo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firestore } from 'firebase';
import { EditSesionComponent } from '../edit-sesion/edit-sesion.component';
import { Utils } from 'src/app/utils/Utils';

@Component({
  selector: 'app-generar-sesiones',
  templateUrl: './generar-sesiones.component.html',
  styleUrls: ['./generar-sesiones.component.scss']
})
export class GenerarSesionesComponent implements OnInit {

  selectYear: number[] = new Array<number>();
  optionYear: number;
  sesiones: Sesion[] = new Array<Sesion>();
  displayedColumns: string[] = ['numeroSesion' ,'fecha', 'horaSesion', 'direccionSesion', 'lugarSesion', 'ubicacionSesion', 'acciones'];
  yearActual: number = new Date().getFullYear();
  constructor(private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<GenerarSesionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grupo: Grupo },
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.buildSelectOptions();
  }

  buildSelectOptions() {
    let fecha = new Date();
    if (this.data.grupo.ultimaGeneracion == fecha.getFullYear()) {
      this.selectYear.push(fecha.getFullYear() + 1);
    } else if (this.data.grupo.ultimaGeneracion == null) {
      this.selectYear.push(fecha.getFullYear());
      this.selectYear.push(fecha.getFullYear() + 1);
    }
  }

  getNroSesionInicial(numeroDiaSesion: number, anio: number): number {
    let numeroSesionInicial: number = 0;
    let fechaInicio: Date = this.getFechaInicio(numeroDiaSesion, anio);
    
    let anioAperturaSesiones = new Date(fechaInicio).getFullYear();
    let fechaAperturaSesiones = new Date( anioAperturaSesiones, 3, 1);
    let fechaDeHoy: Date = new Date();
    
    if(fechaDeHoy <  fechaAperturaSesiones){
      fechaAperturaSesiones.setFullYear(anioAperturaSesiones - 1);
    }

    while(fechaAperturaSesiones.getDay() != numeroDiaSesion) { 
      fechaAperturaSesiones = Utils.addDays(fechaAperturaSesiones, 1);
    }

    while(fechaAperturaSesiones <= fechaInicio) {
      numeroSesionInicial++;
      fechaAperturaSesiones = Utils.addDays(fechaAperturaSesiones, 7);
    }
    return numeroSesionInicial;
  }

  getFechaInicio(numeroDiaSesion: number, anio: number): Date {

    const fechaPrimerDiaProximoAnio = new Date(anio, 0, 1);
    let fechaDeHoy: Date = new Date();

    let anioActual = (new Date(fechaDeHoy)).getFullYear();
    let fechaTentativa: Date = (anioActual == anio) ? new Date(fechaDeHoy): new Date(fechaPrimerDiaProximoAnio);
    
    this.setHourFechaInicio(this.data.grupo.horaSesion, fechaTentativa);
  
    while(fechaTentativa.getDay() != numeroDiaSesion) {
      fechaTentativa = Utils.addDays(fechaTentativa, 1);
    } 

    if(fechaDeHoy > fechaTentativa ){
      fechaTentativa = Utils.addDays(fechaTentativa, 7);
    }

    return fechaTentativa;
  }

  setHourFechaInicio(horaSesion: string, fecha: Date) {
    let hora = Number(horaSesion.substring(0, 2));
    let minutos = Number(horaSesion.substring(3, 5))
    return new Date(fecha.setHours(hora, minutos, 0))
  }

  generarSesion(fechaInicio: Date, numeroSesion: number) : Sesion{
    let sesion = new Sesion();
    sesion.numeroSesion = numeroSesion;
    sesion.direccion = this.data.grupo.direccionSesion;
    sesion.idGrupo = this.data.grupo.idGrupo;
    sesion.lugar = this.data.grupo.lugarSesion;
    sesion.ubicacion = this.data.grupo.ubicacionSesion;
    sesion.fechaHora = firestore.Timestamp.fromDate(this.setHourFechaInicio(this.data.grupo.horaSesion, fechaInicio));
    return sesion;
  }

  generarSesiones(fechaInicio: Date, numeroSesion: number) : Sesion[]{
    let sesiones: Sesion[] = [];
    let fechaCierreSesiones: Date = new Date(fechaInicio.getFullYear(), 3, 1);

    while (fechaInicio < fechaCierreSesiones ){
      this.sesiones.push( this.generarSesion(fechaInicio, numeroSesion) );
      fechaInicio = new Date(fechaInicio.setDate(fechaInicio.getDate() + 7));
      numeroSesion++;
    }

    if (this.sesiones.length > 0) numeroSesion = 1;

    while(fechaInicio.getFullYear() < this.optionYear + 1) {
      this.sesiones.push( this.generarSesion(fechaInicio, numeroSesion) );
      fechaInicio = new Date(fechaInicio.setDate(fechaInicio.getDate() + 7));
      numeroSesion++;
    }

    return sesiones;
  }

  getSesiones() {
    let numeroSesion: number;

    if (this.optionYear == null) {
      this.snackBar.open("Seleccione el año antes de generar las sesiones", '', { duration: 2000 });
      return
    }

    let fechaInicio = this.getFechaInicio(Sesion.valueDia.get(this.data.grupo.diaSesion), this.optionYear);
    numeroSesion = this.getNroSesionInicial(Sesion.valueDia.get(this.data.grupo.diaSesion), this.optionYear);

    let sesiones: Sesion[] = [];

    sesiones = this.generarSesiones(fechaInicio, numeroSesion);
    this.sesiones = [].concat(this.sesiones);
  }

  grabarSesiones() {
    this.data.grupo.ultimaGeneracion = this.sesiones[0].fechaHora.toDate().getFullYear();
    this.dialogRef.close({ sesiones: this.sesiones, grupo: this.data.grupo })
  }

  editSesion(element) {
    const dialogRef = this.dialog.open(EditSesionComponent, { width: '800px', data: { sesion: element } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.sesion) {
        this.updateSesion(element,data?.sesion);
      }
    });
  }

  updateSesion(sesionAnterior: Sesion, sesionNueva: Sesion) {
    let indexSesion = this.sesiones.findIndex(sesion => sesion.fechaHora == sesionAnterior.fechaHora);
    this.sesiones[indexSesion] = sesionNueva;
    this.sesiones = [].concat(this.sesiones);
  }

  deleteSesion(sesionDelete: Sesion) {
    let indexSesion = this.sesiones.findIndex(sesion => sesion.fechaHora == sesionDelete.fechaHora);
    this.sesiones.splice(indexSesion,1);
    this.sesiones = [].concat(this.sesiones);
  }
}
