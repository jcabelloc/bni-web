import { Component, OnInit, ViewChild } from '@angular/core';
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
  
  nombreMiembroFiltrado: string;

  miembros: Miembro[];
  miembroFiltrado: Miembro[];

  miembro: Miembro;

  dataSource:MatTableDataSource<Miembro>;

  showSpinner: boolean = false;

  defaultAvatar: string;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private miembroService: MiembroService,
    public dialogRef: MatDialogRef<BuscarMiembroComponent>,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.updateDefaultAvatar();

    this.miembroService.getMiembros().subscribe(
      miembros => {
        this.miembros = miembros;
        this.dataSource = new MatTableDataSource(this.miembros);
        this.dataSource.paginator = this.paginator;
    });

  }

  updateDefaultAvatar() {
    this.showSpinner = true;
    this.miembroService.getAvatarImgUrl(Miembro.defaultAvatar).subscribe(
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

  filtrarMiembros(){
    
    if(this.nombreMiembroFiltrado == null){

      this.dataSource = new MatTableDataSource(this.miembroFiltrado);
      this.dataSource.paginator = this.paginator;

    } else {

      this.miembroFiltrado = this.miembros.filter(miembro => {
        let nombreCompleto = miembro.nombres + " " + miembro.apellidos;
        return nombreCompleto.toLowerCase().includes(this.nombreMiembroFiltrado.toLowerCase());
        })
      
      this.dataSource = new MatTableDataSource(this.miembroFiltrado);
      this.dataSource.paginator = this.paginator;
    }

  }

  enviarMiembro(miembro: Miembro){  
    this.dialogRef.close({miembroSeleccionado: miembro })
  }
  

}
