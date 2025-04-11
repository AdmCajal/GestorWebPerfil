import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { FormatoMensajeComponent } from '../components/formato-mensaje.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MensajeServices } from '../services/mensaje.services';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { Filtromensaje } from '../model/Filtromensaje';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';

@Component({
  selector: 'ngx-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajeComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController,AfterContentInit {
  @ViewChild(FormatoMensajeComponent, { static: false }) formatoMensajeComponent: FormatoMensajeComponent;

  ltsExportar:SelectItem[];
  filtro: Filtromensaje = new Filtromensaje();
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  bloquearPag:boolean =false;
  lstEstados: SelectItem[];
  lstMensaje: SelectItem[] = [];
  TipoMensaje: SelectItem[];
  lstCompania: SelectItem[] = [];

  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private MensajeServices: MensajeServices

  ) { super(); 
  
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.bloquearPag = true;
    const p1 = this.cargarEstado();
    const p2 = this.cargarTipoMensaje();
    const p3 = this.cargarCombocompania();
    Promise.all([p1,p2,p3]).then((f) => {
      this.bloquearPag = false;
    });
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_PROGRAMA") {
      this.coreBuscar();
    }
  }

  ngAfterContentInit(): void {
    this.cargarEstado();
  }

  coreNuevo(): void {
    this.formatoMensajeComponent.coreIniciarComponente(new MensajeController(this, 'SELECT_MENSAJERIA', ''),ConstanteUI.ACCION_SOLICITADA_NUEVO);
  }

  coreEditar(row) {
    this.formatoMensajeComponent.coreIniciarComponente(new MensajeController(this, 'SELECT_MENSAJERIA', ''),ConstanteUI.ACCION_SOLICITADA_EDITAR, row);
   
  }
  coreVer(row) {
    this.formatoMensajeComponent.coreIniciarComponente(new MensajeController(this, 'SELECT_MENSAJERIA', ''),ConstanteUI.ACCION_SOLICITADA_VER, row);
  }

  coreBuscar(): void {
    console.log("coreBuscar:", this.filtro);
    if (this.filtro.Codigo == null) {
    
    }
    this.bloquearPag = true;
    this.MensajeServices.ListarMensaje(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach((element) => {
        element.num = contado++;
      });
      this.lstMensaje = res;
      console.log("coreBuscar coreBuscar:", res);
    });
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


  exportExcel():void {
  }

  cargarEstado(): void{
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }

  cargarTipoMensaje(): void{
    this.TipoMensaje = [];
    this.TipoMensaje.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPMSJ").forEach(i => {
      this.TipoMensaje.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }

    cargarCombocompania(): Promise<number> {
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
      });
      return 1;
    });
  }

}
