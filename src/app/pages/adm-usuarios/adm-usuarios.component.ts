import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SaveUsuarioComponent } from 'src/app/dialog/save-usuario/save-usuario.component';

@Component({
  selector: 'app-adm-usuarios',
  templateUrl: './adm-usuarios.component.html',
  styleUrls: ['./adm-usuarios.component.scss']
})
export class AdmUsuariosComponent implements OnInit {

  usuarios: Usuario[];

  displayedColumns: string[] = ['avatar', 'nombre', 'email','admin', 'acciones'];

  defaultAvatar: string;

  dataSource:MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private usuarioService: UsuarioService,  public snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateDefaultAvatar();
    this.usuarioService.getUsuarios().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        this.dataSource = new MatTableDataSource(usuarios);
        this.dataSource.paginator = this.paginator;
    });
  }

  updateDefaultAvatar(): void {
    this.usuarioService.getAvatarImgUrl(Usuario.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatar = avatarUrl;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  addUser(){
    const dialogRef = this.dialog.open(SaveUsuarioComponent, { width: '800px', data: { usuario: new Usuario(), tituloOpcion: "Nuevo" } });
  }

  editUser(usuario: Usuario) {
    const dialogRef = this.dialog.open(SaveUsuarioComponent, { width: '800px', data: { usuario , tituloOpcion: "Editar", editar: true } });
  }

}
