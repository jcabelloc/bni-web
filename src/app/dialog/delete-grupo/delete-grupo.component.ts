import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Grupo } from 'src/app/models/grupo';
import { MiembroService } from 'src/app/services/miembro.service';

@Component({
  selector: 'app-delete-grupo',
  templateUrl: './delete-grupo.component.html',
  styleUrls: ['./delete-grupo.component.scss']
})
export class DeleteGrupoComponent implements OnInit {

  constructor(private snackBar: MatSnackBar,
    private miembroService: MiembroService,
    public dialogRef: MatDialogRef<DeleteGrupoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grupo: Grupo }) { }

  ngOnInit(): void {
  }

  returnConfirmDelete() {
    this.miembroService.getMiembrosByIdGrupo(this.data.grupo.idGrupo).subscribe(
      miembros => {
        if (miembros.length == 0 && this.data.grupo.ultimaGeneracion == null) {
          this.dialogRef.close({existeHistorialGrupo: false })
        } else {
          this.dialogRef.close({existeHistorialGrupo: true })
        }
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
}
