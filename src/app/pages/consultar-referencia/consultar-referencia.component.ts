import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultar-referencia',
  templateUrl: './consultar-referencia.component.html',
  styleUrls: ['./consultar-referencia.component.scss']
})
export class ConsultarReferenciaComponent implements OnInit {

  showFilters: boolean = false;
  displayedColumns: string[] = ['nombreReferencia', 'cargoReferencia', 'empresaReferencia', 'fechaSesion', 'nombreMiembro', 'nombreGrupo'];
  constructor() { }

  ngOnInit(): void {
  }

}
