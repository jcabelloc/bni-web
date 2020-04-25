import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Opcion } from 'src/app/models/opcion';


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  opciones: Opcion[] = [
    {
      nombre: 'Gestion',
      opciones: [
        { nombre: 'Adm. General'},
        { nombre: 'Adm. Miembros', ruta:'/main/miembros'},
        { nombre: 'Adm. Grupos', ruta:'/main/grupos'}
      ]
    },

  ];

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  constructor( changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
