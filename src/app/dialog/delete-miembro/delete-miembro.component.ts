import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Miembro } from 'src/app/models/miembro';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-miembro',
  templateUrl: './delete-miembro.component.html',
  styleUrls: ['./delete-miembro.component.scss']
})
export class DeleteMiembroComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
    private asistenciasService: AsistenciaService,
    public dialogRef: MatDialogRef<DeleteMiembroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { miembro: Miembro }) { }

  ngOnInit(): void {

  }

  returnConfirmDelete() {
    this.asistenciasService.getAsistenciasByIdMiembro(this.data.miembro.idMiembro).subscribe(
      asistencias => {
        if (asistencias.length == 0) {
          this.dialogRef.close({existeHistorialMiembro: false })
        } else {
          this.dialogRef.close({existeHistorialMiembro: true })
        }
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }


}
