import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  constructor(public dialogRef: MatDialogRef<SaveMiembroComponent>) { }

  ngOnInit(): void {

  }

  agregarMiembro() {
    this.dialogRef.close({miembro: this.miembro, imageFile: this.selectedFile})
  }

  onFileSelected(event:any) {
    this.selectedFile = event.target.files[0] as File;
    this.imageName = this.selectedFile.name;
  }
}
