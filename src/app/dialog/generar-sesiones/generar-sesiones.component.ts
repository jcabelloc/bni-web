import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Sesion } from '../../models/sesion';
import { Grupo } from 'src/app/models/grupo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firestore } from 'firebase';
import { EditSesionComponent } from '../edit-sesion/edit-sesion.component';

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

  getFechaInicio(numeroDiaSesion: number, anio: number): Date{

    let fechaActual: Date = new Date();

    let fechaInicio: Date = new Date();

    let fechaActualDentro7Dias: Date = new Date();

    let fechaInicioSesion: Date = new Date();
    fechaInicioSesion.setMonth(3);
    fechaInicioSesion.setDate(1);

    if(fechaInicio.getFullYear() < anio){
      fechaInicioSesion.setFullYear(anio);
      fechaInicioSesion.setMonth(0);
      fechaInicioSesion.setDate(1);
    }

    let dayActual: number = fechaInicio.getDate();
      
    if (dayActual <= numeroDiaSesion) {
      fechaInicio.setDate(fechaInicio.getDate() + (numeroDiaSesion - dayActual) - 7)
    } else {
      fechaInicio.setDate(fechaInicio.getDate() - (dayActual - numeroDiaSesion));
     
      fechaActualDentro7Dias.setDate(fechaActualDentro7Dias.getDate() + 7);

      if(fechaActualDentro7Dias.getMonth() > fechaInicio.getMonth()){
        fechaInicio.setMonth(fechaInicio.getMonth() + 1);
      }

    }

    while(fechaInicio < fechaActual){
      fechaInicio.setDate(fechaInicio.getDate() + 7);
    }

    if(fechaInicio.getFullYear() < anio){
      while(fechaInicio < fechaInicioSesion){
        fechaInicio.setDate(fechaInicio.getDate() + 7);
      }
    }

    this.setHourFechaInicio(this.data.grupo.horaSesion, fechaInicio);

    if(fechaActual > fechaInicio){
      fechaInicio.setDate(fechaInicio.getDate() + 7);
    }

    return fechaInicio;
  }

  getNroSesionInicial(numeroDiaSesion: number, anio: number): number {
    let nroSesionInicial = 1;

    let fechaObtenida: Date = this.getFechaInicio(numeroDiaSesion, anio);
    let fechaObtenidaCopia: Date = this.getFechaInicio(numeroDiaSesion, anio);
    
    let fechaInicioSesion: Date = new Date();
    fechaInicioSesion.setMonth(3);
    fechaInicioSesion.setDate(1);

    if(fechaObtenida >= fechaInicioSesion) {

      while(fechaObtenida >= fechaInicioSesion){
        fechaObtenida.setDate(fechaObtenida.getDate() - 7);
      }

      if(fechaObtenida < fechaInicioSesion){
        fechaObtenida.setDate(fechaObtenida.getDate() + 7);
      }

      while(fechaObtenida < fechaObtenidaCopia){
        nroSesionInicial++;
        fechaObtenida.setDate(fechaObtenida.getDate() + 7);
      }

      if(fechaObtenida > fechaObtenidaCopia){
        nroSesionInicial--;
        fechaObtenida.setDate(fechaObtenida.getDate() - 7);
      }

    }
    return nroSesionInicial;
  }

  setHourFechaInicio(horaSesion: string, fecha: Date) {
    let hora = Number(horaSesion.substring(0, 2));
    let minutos = Number(horaSesion.substring(3, 5))
    return new Date(fecha.setHours(hora, minutos, 0))
  }

  getSesiones() {
    let numeroSesion: number;

    if (this.optionYear == null) {
      this.snackBar.open("Seleccione el año antes de generar las sesiones", '', { duration: 2000 });
      return
    }

    let fechaInicio = this.getFechaInicio(Sesion.valueDia.get(this.data.grupo.diaSesion),this.optionYear);
    numeroSesion = this.getNroSesionInicial(Sesion.valueDia.get(this.data.grupo.diaSesion),this.optionYear);

    let sesion: Sesion;

    let fechaActual: Date = new Date();

    let fechaFinal: Date = new Date();
    fechaFinal.setFullYear(fechaInicio.getFullYear());
    fechaFinal.setMonth(2);
    fechaFinal.setDate(31);

    if(fechaActual.getFullYear() < fechaInicio.getFullYear()){
      while (fechaInicio <= fechaFinal) {
        sesion = new Sesion();
        sesion.numeroSesion = numeroSesion;
        sesion.direccion = this.data.grupo.direccionSesion;
        sesion.idGrupo = this.data.grupo.idGrupo;
        sesion.lugar = this.data.grupo.lugarSesion;
        sesion.ubicacion = this.data.grupo.ubicacionSesion;
        sesion.fechaHora = firestore.Timestamp.fromDate(this.setHourFechaInicio(this.data.grupo.horaSesion, fechaInicio));
        fechaInicio = new Date(fechaInicio.setDate(fechaInicio.getDate() + 7));
        numeroSesion++;
        this.sesiones.push(sesion);
      }
      
      numeroSesion = 1;
      while (fechaInicio.getFullYear() < this.optionYear + 1) {
        sesion = new Sesion();
        sesion.numeroSesion = numeroSesion;
        sesion.direccion = this.data.grupo.direccionSesion;
        sesion.idGrupo = this.data.grupo.idGrupo;
        sesion.lugar = this.data.grupo.lugarSesion;
        sesion.ubicacion = this.data.grupo.ubicacionSesion;
        sesion.fechaHora = firestore.Timestamp.fromDate(this.setHourFechaInicio(this.data.grupo.horaSesion, fechaInicio));
        fechaInicio = new Date(fechaInicio.setDate(fechaInicio.getDate() + 7));
        numeroSesion++;
        this.sesiones.push(sesion);
      }

    }else {
      while (fechaInicio.getFullYear() < this.optionYear + 1) {
        sesion = new Sesion();
        sesion.numeroSesion = numeroSesion;
        sesion.direccion = this.data.grupo.direccionSesion;
        sesion.idGrupo = this.data.grupo.idGrupo;
        sesion.lugar = this.data.grupo.lugarSesion;
        sesion.ubicacion = this.data.grupo.ubicacionSesion;
        sesion.fechaHora = firestore.Timestamp.fromDate(this.setHourFechaInicio(this.data.grupo.horaSesion, fechaInicio));
        fechaInicio = new Date(fechaInicio.setDate(fechaInicio.getDate() + 7));
        numeroSesion++;
        this.sesiones.push(sesion);
      }
    }
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
