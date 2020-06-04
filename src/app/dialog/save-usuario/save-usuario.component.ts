import { Component, OnInit, Inject } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BuscarMiembroComponent } from '../buscar-miembro/buscar-miembro.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-save-usuario',
  templateUrl: './save-usuario.component.html',
  styleUrls: ['./save-usuario.component.scss']
})
export class SaveUsuarioComponent implements OnInit {

  usuario: Usuario;
  tituloOpcion: string;

  password: string;
  passwordHidden = true;

  showSpinner: boolean = false;
  defaultAvatar: any;
  selectedAvatar: File;

  esMiembro: boolean;

  editarUsuario: boolean;
  editPassword: boolean;

  nombreEstadoCuenta: string;

  constructor( private usuarioService: UsuarioService,
              public dialogRef: MatDialogRef<SaveUsuarioComponent>, 
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario, tituloOpcion: string, editar: boolean } ) { }

  ngOnInit(): void {
    this.usuario = this.data.usuario;

    this.editarUsuario = false;
    this.editPassword = true;

    if(this.data?.editar){
      this.editarUsuario = true;
      this.editPassword = false;
    }
    
    this.defaultAvatar = this.usuario.avatarUrl;
    if (!this.defaultAvatar) {
      this.updateDefaultAvatar();
    }

    this.tituloOpcion = this.data.tituloOpcion;
    this.esMiembro = false;
  }

  updateDefaultAvatar() {
    this.showSpinner = true;
    this.usuarioService.getAvatarImgUrl(Usuario.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatar = avatarUrl;
        this.showSpinner = false;
      },
      err => {
        this.snackBar.open("No se encontró la foto predeterminada", '', { duration: 2000 });
        this.showSpinner = false;
      }
    );
  }

  onAvatarSelected(event: any) {
    const reader: FileReader = new FileReader();
    this.selectedAvatar = event.target.files[0] as File;
    reader.readAsDataURL(this.selectedAvatar);
    reader.onload = (event) => {
      this.defaultAvatar = event.target.result;
      this.usuario.avatarUrl = this.defaultAvatar;
    }
  }

  updateUsuarioFromMiembro(){
    const dialogRefMiembro = this.dialog.open(BuscarMiembroComponent, { width: '800px', height: '600px' });
    dialogRefMiembro.afterClosed().subscribe(data => {
      if (data?.miembroSeleccionado){
        
        this.usuario.nombres = data.miembroSeleccionado.nombres;
        this.usuario.apellidos = data.miembroSeleccionado.apellidos;
        this.usuario.email = data.miembroSeleccionado.email;

        if ( data?.miembroSeleccionado?.avatarUrl ) {
          this.usuario.avatarUrl = data.miembroSeleccionado.avatarUrl;
          this.defaultAvatar = data.miembroSeleccionado.avatarUrl;
        }

        this.usuario.esAdmin = false;
        this.usuario.idMiembro = data.miembroSeleccionado.idMiembro;
      }else{
        this.snackBar.open("No seleccionó ningún miembro", '', { duration: 2000 });
      }
    });
    
  }

  createUsuario(){

    if( this?.usuario?.nombres ){
      this.usuario.estaActivo = this.estaActivo;
      this.usuarioService.createUsuario(this.usuario, this.password).subscribe(
        () => {
          this.snackBar.open("Creado correctamente", '', { duration: 2000 });
          this.dialogRef.close();
        },
        err => this.snackBar.open(err, '', { duration: 2000 })
        );  
    } else {
      this.snackBar.open("Debe ingresar los datos del usuario", '', { duration: 2000 });
    }
    
    
  }

  initDefaultData(){
    this.updateDefaultAvatar();
    this.usuario = new Usuario;
    this.password = "";
  }

  changeEditPasswordStatus(event: MatSlideToggleChange){
    this.password = "";
    if(event.checked){
      this.editPassword = true;
    } else {
      this.editPassword = false;
    }
  }

  updateUsuario(){

    if (this.password == undefined){
      this.password = "";
    }

    this.usuario.estaActivo = this.estaActivo;
    
    this.usuarioService.updateUsuario(this.usuario, this.usuario['idUsuario'], this.password).subscribe(
      () => {
        this.snackBar.open("Se actualizó correctamente", '', { duration: 2000 });
        this.dialogRef.close();
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
      );  
    
  }

  changeAccountStatus(event: MatSlideToggleChange){
    if(event.checked){
      this.nombreEstadoCuenta = "Activo";
    } else {
      this.nombreEstadoCuenta = "Inactivo";
    }
  }

}
