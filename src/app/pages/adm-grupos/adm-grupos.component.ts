import { Component, OnInit } from '@angular/core';
import { SaveGrupoComponent } from 'src/app/dialog/save-grupo/save-grupo.component';
import { MatDialog } from '@angular/material/dialog';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Miembro } from 'src/app/models/miembro';
import { DeleteGrupoComponent } from 'src/app/dialog/delete-grupo/delete-grupo.component';

@Component({
  selector: 'app-adm-grupos',
  templateUrl: './adm-grupos.component.html',
  styleUrls: ['./adm-grupos.component.scss']
})
export class AdmGruposComponent implements OnInit {

  grupos: Grupo[] = new Array<Grupo>();
  defaultAvatarUrl: string;
  displayedColumns: string[] = ['avatar', 'nombre', 'diaSesion', 'direccionSesion', 'lugarSesion', 'horaSesion','acciones'];
  usuario: Usuario; 
  miembro: Miembro;
  constructor(private dialog: MatDialog, private grupoService: GrupoService, private snackBar: MatSnackBar, private authentication: AuthenticationService) { }

  ngOnInit(): void {
    this.setDefaultAvatarUrl();
    this.usuario = this.authentication.getUsuario();
    this.miembro = this.authentication.getMiembro();
    if(this.usuario.esAdmin){
      this.grupoService.getGrupos().subscribe(
        grupos => { this.grupos = grupos; },
        err => this.snackBar.open(err, '', { duration: 2000 })
      );
    } else if(this.miembro.esAdmGrupo){
     this.grupoService.findById(this.miembro.idGrupo).subscribe(
      grupo =>{
        this.grupos = [];
        this.grupos.push(grupo);
        this.grupos = [].concat(this.grupos);
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
     ) 
    }
    
  }

  setDefaultAvatarUrl(): void {
    this.grupoService.getAvatarImgUrl(Grupo.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatarUrl = avatarUrl;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  addGrupo() {
    const dialogRef = this.dialog.open(SaveGrupoComponent, { width: '800px', data: { grupo: new Grupo(), opcion: "Nuevo" } });
  }

  editGrupo(grupo: Grupo) {
    const dialogRef = this.dialog.open(SaveGrupoComponent, { width: '800px', data: { grupo: grupo, opcion: "Editar", editar: true } });
  }

  deleteGrupo(grupo: Grupo) {
    const dialogRef = this.dialog.open(DeleteGrupoComponent, { width: '800px', data: { grupo: grupo} });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.existeHistorialGrupo == false) {
        this.grupoService.deleteGrupo(grupo.idGrupo).subscribe(
          () => this.snackBar.open("Se eliminó correctamente", '', { duration: 2000 }),
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      }else if(data?.existeHistorialGrupo){
        this.snackBar.open("El grupo tiene historial, no se puede eliminar", '', { duration: 2000 });
      }
    });
  }
}
