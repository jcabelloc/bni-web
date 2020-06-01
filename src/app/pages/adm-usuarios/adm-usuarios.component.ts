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

  defaultAvatarUrl: string;

  dataSource:MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private usuarioService: UsuarioService,  public snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setDefaultAvatarUrl();
    this.usuarioService.getUsuarios().subscribe(
      usuarios => {
        this.usuarios = usuarios;
        this.dataSource = new MatTableDataSource(usuarios);
        this.dataSource.paginator = this.paginator;
    });
  }

  setDefaultAvatarUrl(): void {
    this.usuarioService.getAvatarImgUrl(Usuario.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatarUrl = avatarUrl;
      },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }

  addUsuario(){
    const dialogRef = this.dialog.open(SaveUsuarioComponent, { width: '800px', data: { usuario: new Usuario(), opcion: "Nuevo" } });
  }

}
