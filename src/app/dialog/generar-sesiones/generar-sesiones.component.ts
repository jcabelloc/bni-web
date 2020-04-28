import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generar-sesiones',
  templateUrl: './generar-sesiones.component.html',
  styleUrls: ['./generar-sesiones.component.scss']
})
export class GenerarSesionesComponent implements OnInit {

  selectYear: number[] = new Array<number>();
  optionYear: number;
  constructor(public dialogRef: MatDialogRef<GenerarSesionesComponent>, @Inject(MAT_DIALOG_DATA) public data: { ultimaGeneracion: Date }) { }

  ngOnInit(): void {
    this.setSelectOptions();
  }
  setSelectOptions() {
    let fecha: Date;
    if (this.data.ultimaGeneracion == null) {
      fecha = new Date();
     this.buildSelectOptions(fecha.getFullYear());
    }
  }

  buildSelectOptions(year: number) {
    this.selectYear.push(year);
    this.selectYear.push(year + 1);
  }
}
