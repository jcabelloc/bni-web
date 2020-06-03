import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BuscarMiembroComponent } from '../buscar-miembro/buscar-miembro.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-save-usuario',
  templateUrl: './save-usuario.component.html',
  styleUrls: ['./save-usuario.component.scss']
})
export class SaveUsuarioComponent implements OnInit {

  usuario: Usuario;
  opcion: string;

  password: string;
  hide = true;

  showSpinner: boolean = false;
  defaultProfile: any;
  selectedFile: File;

  esMiembro: boolean;

  constructor( private usuarioService: UsuarioService,
              private authenticationService: AuthenticationService,
              public dialogRef: MatDialogRef<SaveUsuarioComponent>, 
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario, opcion: string } ) { }

  ngOnInit(): void {
    this.usuario = { ... this.data.usuario}
    this.opcion = this.data.opcion;
    this.esMiembro = false;
    
    if(this.usuario.idMiembro == null || this.usuario.avatarUrl == null) {
      this.getAvatarProfileDefault();
    }

  }

  getAvatarProfileDefault() {
    this.showSpinner = true;
    this.usuarioService.getAvatarImgUrl(Usuario.defaultAvatar).subscribe(
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

  onFileSelected(event: any) {
    const reader: FileReader = new FileReader();
    this.selectedFile = event.target.files[0] as File;
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (event) => {
      this.defaultProfile = event.target.result;
      this.usuario.avatarUrl = this.defaultProfile;
    }
  }

  buscarMiembro(){
    const dialogRefMiembro = this.dialog.open(BuscarMiembroComponent, { width: '800px', height: '600px' });
    //this.getAvatarProfileDefault()
    dialogRefMiembro.afterClosed().subscribe(data => {
      if (data?.MiembroSeleccionado){
        
        this.usuario.nombres = data.MiembroSeleccionado.nombres;
        this.usuario.apellidos = data.MiembroSeleccionado.apellidos;
        this.usuario.email = data.MiembroSeleccionado.email;

        if ( data?.MiembroSeleccionado?.avatarUrl ) {
          this.usuario.avatarUrl = data.MiembroSeleccionado.avatarUrl;
          this.defaultProfile = data.MiembroSeleccionado.avatarUrl;
        }

        this.usuario.esAdmin = false;
        this.usuario.idMiembro = data.MiembroSeleccionado.idMiembro;
      }else{
        this.snackBar.open("No seleccionó ningún Miembro", '', { duration: 2000 });
      }
    });
    
  }

  guardarUsuario(){

    this.usuarioService.createUsuario(this.usuario, this.password).subscribe(() => {
      this.snackBar.open("Creado correctamente", '', { duration: 2000 })
    });  
    this.dialogRef.close();
  }

  validar(){
    this.getAvatarProfileDefault();
    this.usuario = new Usuario;
  }
}
