import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Miembro } from 'src/app/models/miembro';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MiembroService } from 'src/app/services/miembro.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-save-miembro',
  templateUrl: './save-miembro.component.html',
  styleUrls: ['./save-miembro.component.scss']
})
export class SaveMiembroComponent implements OnInit {

  miembro: Miembro = new Miembro();
  selectedFile: File;
  defaultProfile: any;
  opcion: string;
  grupos: Grupo[];
  disabledSelect: boolean;
  showSpinner: boolean = false;
  usuario: Usuario;
  estados = Miembro.estadoMiembro;
  constructor(private snackBar: MatSnackBar,
    private grupoService: GrupoService,
    private miembroService: MiembroService,
    private authentication: AuthenticationService,
    public dialogRef: MatDialogRef<SaveMiembroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { miembro: Miembro, opcion: string }) { }


  ngOnInit(): void {
    this.getGrupos();
    this.miembro = { ... this.data.miembro };
    this.opcion = this.data.opcion;
    this.defaultProfile = this.miembro.avatarUrl;
    if (this.miembro.idMiembro == null || this.miembro.avatarUrl == null) {
      this.getAvatarProfileDefault();
    }
    this.usuario = this.authentication.getUsuario();
    if(!this.usuario.esAdmin){
      this.disabledSelect = true;
    }

  }
  getAvatarProfileDefault() {
    this.showSpinner = true;
    this.miembroService.getAvatarImgUrl(Miembro.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultProfile = avatarUrl;
        this.showSpinner = false;
      },
      err => {
        this.snackBar.open("No se encontró la foto prederminada", '', { duration: 2000 });
        this.showSpinner = false;
      }
    );
  }
  agregarMiembro() {
    this.miembro.nombreGrupo = this.getNombreGrupoById(this.miembro.idGrupo);
    this.dialogRef.close({ miembro: this.miembro, imageFile: this.selectedFile })
  }

  getNombreGrupoById(idGrupo): string {
    return this.grupos.filter(grupo => grupo.idGrupo == idGrupo)[0].nombre;
  }

  onFileSelected(event: any) {

    const reader: FileReader = new FileReader();
    this.selectedFile = event.target.files[0] as File;
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (event) => {
      this.defaultProfile = event.target.result;
    }
  }

  getGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
}
