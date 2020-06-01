import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Miembro } from 'src/app/models/miembro';
import { MiembroService } from 'src/app/services/miembro.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-buscar-miembro',
  templateUrl: './buscar-miembro.component.html',
  styleUrls: ['./buscar-miembro.component.scss']
})
export class BuscarMiembroComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'nombre', 'email', 'seleccionar'];
  
  nombreMiembro: string;

  miembros: Miembro[];
  miembroFiltrado: Miembro[];

  miembro: Miembro;

  dataSource:MatTableDataSource<Miembro>;

  showSpinner: boolean = false;

  defaultAvatarUrl: string;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private miembroService: MiembroService,
    public dialogRef: MatDialogRef<BuscarMiembroComponent>,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.getAvatarProfileDefault();

    this.miembroService.getMiembros().subscribe(
      miembros => {

        this.miembroFiltrado = miembros.filter(miembro => {
          return miembro.esAdmGrupo
        })

        this.miembros = this.miembroFiltrado;
        this.dataSource = new MatTableDataSource(this.miembroFiltrado);
        this.dataSource.paginator = this.paginator;
    });

  }

  getAvatarProfileDefault() {
    this.showSpinner = true;
    this.miembroService.getAvatarImgUrl(Miembro.defaultAvatar).subscribe(
      avatarUrl => {
        this.defaultAvatarUrl = avatarUrl;
        this.showSpinner = false;
      },
      err => {
        this.snackBar.open("No se encontró la foto prederminada", '', { duration: 2000 });
        this.showSpinner = false;
      }
    );
  }

  filtrarMiembros(){
    
    if(this.nombreMiembro == null){

      this.dataSource = new MatTableDataSource(this.miembroFiltrado);
      this.dataSource.paginator = this.paginator;

    } else {

      this.miembroFiltrado = this.miembros.filter(miembro => {
        let nombreCompleto = miembro.nombres + " " + miembro.apellidos;
        return nombreCompleto.toLowerCase().includes(this.nombreMiembro.toLowerCase());
        })
      
      this.dataSource = new MatTableDataSource(this.miembroFiltrado);
      this.dataSource.paginator = this.paginator;
    }

  }

  enviarMiembro(miembro: Miembro){  
    this.dialogRef.close({MiembroSeleccionado: miembro })
  }
  

}
