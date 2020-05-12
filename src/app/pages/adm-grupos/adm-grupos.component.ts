import { Component, OnInit } from '@angular/core';
import { SaveGrupoComponent } from 'src/app/dialog/save-grupo/save-grupo.component';
import { MatDialog } from '@angular/material/dialog';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Miembro } from 'src/app/models/miembro';

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
    dialogRef.afterClosed().subscribe(data => {
      if (data?.grupo) {
        this.grupoService.createGrupo(data?.grupo).subscribe(
          idGrupo => {
             if(data?.avatarFile)
             {
               data.grupo.idGrupo = idGrupo;
               this.grupoService.uploadAvatar(idGrupo,data?.avatarFile).subscribe(
                 () => this.updateGrupo(data?.grupo,"guardó"),
                 err =>this.snackBar.open(err, '', { duration: 2000 }));
             }else{
              this.snackBar.open("Se guardó correctamente", '', { duration: 2000 });
             }
          },  
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      }
    });
  }

  editGrupo(grupo: Grupo) {
    const dialogRef = this.dialog.open(SaveGrupoComponent, { width: '800px', data: { grupo: grupo, opcion: "Editar" } });
    dialogRef.afterClosed().subscribe(data => {
      if (data?.avatarFile) {
        this.grupoService.uploadAvatar(data?.grupo.idGrupo, data?.avatarFile).subscribe(
          () => this.updateGrupo(data?.grupo,"actualizó"),
          err => this.snackBar.open(err, '', { duration: 2000 }) 
        );
      }else {
        this.updateGrupo(data?.grupo,"actualizó");
      }
    });
  }

  updateGrupo(grupo: Grupo, mensaje: string){
    this.grupoService.getAvatarImgUrl(grupo.idGrupo).subscribe(
      avatarUrl => {
        grupo.avatarUrl = avatarUrl;
        this.grupoService.updateGrupo(grupo).subscribe(
          () => this.snackBar.open("Se "+ mensaje +" correctamente", '', { duration: 2000 }),
          err => this.snackBar.open(err, '', { duration: 2000 })
        );
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    ); 
  }

  deleteGrupo(idGrupo: string) {
    this.grupoService.deleteGrupo(idGrupo).subscribe(
      () => this.snackBar.open("Se eliminó correctamente", '', { duration: 2000 }),
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
}
