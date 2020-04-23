import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Miembro } from 'src/app/models/miembro';

@Component({
  selector: 'app-save-miembro',
  templateUrl: './save-miembro.component.html',
  styleUrls: ['./save-miembro.component.scss']
})
export class SaveMiembroComponent implements OnInit {

  miembro: Miembro  = new Miembro();
  constructor(public dialogRef: MatDialogRef<SaveMiembroComponent>) { }

  ngOnInit(): void {
   
  }
  
  agregarMiembro() {
    this.dialogRef.close()
  }

}
