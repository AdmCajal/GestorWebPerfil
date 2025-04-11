import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';

@Component({
  selector: 'ngx-reserva-pagar',
  templateUrl: './reserva-pagar.component.html',
  styleUrls: ['./reserva-pagar.component.scss']
})
export class ReservaPagarComponent extends ComponenteBasePrincipal implements OnInit  {
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  position: string = "top";
  puedeEditar: boolean = false;
  dto:any;
  constructor(
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  coreIniciarComponente(   msj: MensajeController, accion: string, titulo, rowdata?: any) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo} ${accion}`;
    this.dialog = true;
    //this.bloquearPag = true;
    this.dto.MonedaCodigo = "EX";
  }
}
