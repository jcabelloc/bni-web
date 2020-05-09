import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Miembro } from 'src/app/models/miembro';
import { Grupo } from 'src/app/models/grupo';
import { GrupoService } from 'src/app/services/grupo.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-save-miembro',
  templateUrl: './save-miembro.component.html',
  styleUrls: ['./save-miembro.component.scss']
})
export class SaveMiembroComponent implements OnInit {

  miembro: Miembro = new Miembro();
  selectedFile: File;
  defaultProfile: any = "../../../assets/default-profile.png";
  opcion: string;
  grupos: Grupo[];
  constructor(private snackBar: MatSnackBar,
    private grupoService: GrupoService,
    public dialogRef: MatDialogRef<SaveMiembroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { miembro: Miembro, opcion: string }) { }


  ngOnInit(): void {
    this.getGrupos();
    if (this.data.miembro) {
      this.miembro = { ... this.data.miembro };
    }
    this.opcion = this.data.opcion;
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
