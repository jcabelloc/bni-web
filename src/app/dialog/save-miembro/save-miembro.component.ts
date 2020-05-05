import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Miembro } from 'src/app/models/miembro';
import { AngularFireStorage } from '@angular/fire/storage';
import { database } from 'firebase';

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
  constructor(public dialogRef: MatDialogRef<SaveMiembroComponent>, @Inject(MAT_DIALOG_DATA) public data: { miembro: Miembro, opcion : string }) { }

  ngOnInit(): void {
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
}
