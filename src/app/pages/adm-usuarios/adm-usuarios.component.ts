import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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

  constructor(private usuarioService: UsuarioService,  public snackBar: MatSnackBar) { }

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

}
