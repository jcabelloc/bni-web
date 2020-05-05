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
  imageName: string;
  opcion: string;
  grupos: Grupo[];
  constructor(private snackBar: MatSnackBar,
              private grupoService: GrupoService, 
              public dialogRef: MatDialogRef<SaveMiembroComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { miembro: Miembro, opcion : string }) { }


  ngOnInit(): void {
    this.getGrupos();
    if (this.data.miembro) {
        this.miembro = {... this.data.miembro};
    }
    this.opcion = this.data.opcion;
  }

  agregarMiembro() {
    this.dialogRef.close({ miembro: this.miembro, imageFile: this.selectedFile })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.imageName = this.selectedFile.name;
  }

  getGrupos() {
    this.grupoService.getGrupos().subscribe(
      grupos => { this.grupos = grupos; },
      err => this.snackBar.open(err, '', { duration: 2000 })
    );
  }
}
