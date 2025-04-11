import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { LoginService } from '../../../auth/service/login.service';
import { dtoaseguradora } from '../../../framework-comun/Aseguradora/dominio/dto/dtoaseguradora';
import { AseguradoraService } from '../../../framework-comun/Aseguradora/servicio/aseguradora.service';
import { AseguradoraMantenimientoComponent } from '../../../framework-comun/Aseguradora/vista/aseguradora-mantenimiento.component';
import { Filtroaseguradora } from '../dominio/filtro/Filtroaseguradora';


@Component({
  selector: 'ngx-aseguradora',
  templateUrl: './aseguradora.component.html',
  styleUrls: ['./aseguradora.component.scss']
})
export class AseguradoraComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  @ViewChild(AseguradoraMantenimientoComponent, { static: false }) aseguradoraMantenimientoComponent: AseguradoraMantenimientoComponent;
  filtro: Filtroaseguradora = new Filtroaseguradora();
  lstPacienteClinica: any[] = [];
  lstEstado: SelectItem[] = [];
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  loading: boolean;
  bloquearPag: boolean;
  dtoEditarAseguradora: dtoaseguradora = new dtoaseguradora();
  constructor(
    private aseguradoraService: AseguradoraService
  ) {
    super();

  }
  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == 'TIPMAASEGURADORAEDIT') {
      if (!this.esNumeroVacio(mensage.resultado)) {
        this.coreBuscar();
      }
    }
  }

  enDesarrollo() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarEstados();

    Promise.all([p1]).then(resp => {
      this.bloquearPag = false;
    });

    
  }

  coreNuevo(): void {
    this.openNew();
  }

  cargarEstados() {
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstado.push({ label: 'Activo', value: 1 });
    this.lstEstado.push({ label: 'Inactivo', value: 2 });
  }

  coreBuscar(): void {
    this.dataTableComponent.first = 0;
    this.grillaCargarDatos({ first: this.dataTableComponent.first });
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

  openNew() {
    // this.aseguradoraMantenimientoComponent.iniciarComponente('NUEVO',this.objetoTitulo.menuSeguridad.titulo)
    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAASEGURADORA', ''), "NUEVO");
  }

  validarTeclaEnter(evento) {

    if (evento.key == "Enter") {
      this.coreBuscar();

    }
  }


  invactivarProduct(rowdata: any) {

  }

  verProduct(rowdata: any) {

    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAASEGURADORA', ''), "VER", rowdata);

  }

  editProduct(rowdata: any) {
    // this.dtoEditarAseguradora=rowdata;
    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAASEGURADORAEDIT', ''), "EDITAR", rowdata);
  }

  grillaCargarDatos(event: LazyLoadEvent) {
    this.loading = true;
    // this.bloquearPagina();
    this.aseguradoraService.listarpaginado(this.filtro).then((res) => {

      var contado = 1;
      res.forEach(element => {
        element.numeroaseguradora = contado++;
      });
      // this.filtro.paginacion = res;
      this.loading = false;
      this.lstPacienteClinica = res;
      //this.desbloquearPagina();
    });
  }



}
