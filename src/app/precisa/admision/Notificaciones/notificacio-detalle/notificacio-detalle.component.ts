import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { FiltroControl } from '../../../ventas/Control/model/filtroControl';
import { ControlService } from '../../../ventas/Control/service/control.service';
@Component({
  selector: 'ngx-notificacio-detalle',
  templateUrl: './notificacio-detalle.component.html',
  styleUrls: ['./notificacio-detalle.component.scss']
})
export class NotificacioDetalleComponent  extends ComponenteBasePrincipal implements OnInit {

  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  position: string = "top";
  puedeEditar: boolean = false;
  dto:any;
  usuario:string;
  fechaCreacion:Date;
  fechaModificacion:Date;
  FiltroLetra: FiltroControl = new FiltroControl();
  lstLetra: any[] = [];
  lstDetalle: any[] = [];
  lstTotal: any[] = [];
  constructor(    private ControlService: ControlService) {super(); }

  ngOnInit(): void {
  }

  async iniciarComponenteMaestro( accion: string, titulo, rowdata?: any) {
    
    // this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.bloquearPag = true;

    this.dto = rowdata
    if (this.validarform == "VER") {
      this.dto = rowdata;
      this.puedeEditar = false;
      this.dto.MonedaCodigo = rowdata.MonedaCodigo.trim();
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.fechaCreacion = new Date(this.dto.FechaCreacion);
      if (this.dto.FechaModificacion != null) {
        this.fechaModificacion = new Date(this.dto.FechaModificacion);
      }
      this.FiltroLetra.IdContrato = this.dto.IdContrato;
      console.log("Lote coreBuscar:", this.FiltroLetra);
      var vTotal = 0;
      var vAbonado = 0;
      var vFaltante = 0;
      this.bloquearPag = true;
      const data: any[] = await this.ControlService.ListarLetra(this.FiltroLetra);
      console.log("ListarLetra listado:", data);
      this.lstLetra = data;
      this.bloquearPag = false;

      var contado = 0;
      this.lstLetra.forEach((element) => {
        element.num = contado++;
        vTotal += element.MontoTotal;
        if (element.Estado == 1) {
          vFaltante += element.MontoTotal;
        }
        if (element.Estado == 2) {
          vAbonado += element.MontoTotal;
        }
      });

      console.log("variable 1° vFaltante:", vFaltante);
      console.log("variable vTotal:", vTotal);
      console.log("variable vFaltante:", vFaltante);
      console.log("variable vAbonado:", vAbonado);

      this.lstTotal = await [
        {
          num: 1,
          Total: vTotal,
          Abonado: vAbonado,
          Faltante: vFaltante
        }
      ];
      console.log("   this.lstTotal", this.lstTotal);
    
    }
  }
}
