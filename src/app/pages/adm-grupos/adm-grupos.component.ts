import { Component, OnInit } from '@angular/core';
import { SaveGrupoComponent } from 'src/app/dialog/save-grupo/save-grupo.component';
import { MatDialog } from '@angular/material/dialog';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adm-grupos',
  templateUrl: './adm-grupos.component.html',
  styleUrls: ['./adm-grupos.component.scss']
})
export class AdmGruposComponent implements OnInit {

  constructor(private dialog:MatDialog, private grupoService: GrupoService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  addGrupo() {
      const dialogRef = this.dialog.open(SaveGrupoComponent, { width: '800px' , data: { grupo : new Grupo(), opcion: "Nuevo"}});
      dialogRef.afterClosed().subscribe(data => {
        if (data?.grupo) {
            this.grupoService.createGrupo(data?.grupo).subscribe(
              () => {this.snackBar.open("Se guardó correctamente", '', { duration: 2000 })},
              err => this.snackBar.open(err, '', { duration: 2000 })
            );
        }
      });
    }
  }
