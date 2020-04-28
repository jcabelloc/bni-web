import { Component, OnInit } from '@angular/core';
import { GrupoService } from 'src/app/services/grupo.service';
import { Grupo } from 'src/app/models/grupo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GenerarSesionesComponent } from 'src/app/dialog/generar-sesiones/generar-sesiones.component';

@Component({
  selector: 'app-adm-sesiones',
  templateUrl: './adm-sesiones.component.html',
  styleUrls: ['./adm-sesiones.component.scss']
})
export class AdmSesionesComponent implements OnInit {

  idGrupo: string = '4IPmQZ1Wb4ccRW2DIfls'
  ultimaGeneracion: Date = null;
  grupo: Grupo;
  constructor(private grupoService: GrupoService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

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
    const dialogRef = this.dialog.open(GenerarSesionesComponent, { width: '800px', data:{ultimaGeneracion: this.ultimaGeneracion } });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        
      }
    });
  }
}
