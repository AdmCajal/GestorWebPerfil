import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../util/ComponenteBasePrincipa';



@Component({
  selector: 'ngx-medico-atenciones',
  templateUrl: './medico-atenciones.component.html',

})
export class MedicoAtencionesComponent implements OnInit {



  constructor() {

  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }



}
