import { Component, OnInit } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo } from 'src/app/models/grupo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GenerarSesionesComponent } from 'src/app/dialog/generar-sesiones/generar-sesiones.component';
import { SesionService } from 'src/app/services/sesion.service';

@Component({
  selector: 'app-adm-sesiones',
  templateUrl: './adm-sesiones.component.html',
  styleUrls: ['./adm-sesiones.component.scss']
})
export class AdmSesionesComponent implements OnInit {

  idGrupo: string = 'btJ5XSkYP9lwqZPJxJnj';
  grupo: Grupo = new Grupo();
  constructor(private grupoService: GrupoService, private sesionService: SesionService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getGrupo();
  }

  getGrupo() {
    this.grupoService.findById(this.idGrupo).subscribe(
      grupo => { this.grupo = grupo },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  generateSesions() {
    const dialogRef = this.dialog.open(GenerarSesionesComponent, { width: '800px', data: { grupo: this.grupo } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.sesiones) {
        this.sesionService.createSesiones(data.sesiones).subscribe(
          () => {
            this.grupoService.updateGrupo(data?.grupo).subscribe(
              () => this.snackBar.open("Se gabraron correctamente las sesiones", '', { duration: 2000 }),
              err => this.snackBar.open(err, '', { duration: 2000 }));
          }, err => this.snackBar.open(err, '', { duration: 2000 }));
      }
    });
  }
}
