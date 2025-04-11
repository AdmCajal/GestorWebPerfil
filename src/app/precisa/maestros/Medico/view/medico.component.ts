import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { FiltroMedico } from '../dominio/filtro/Filtromedico';
import { MedicoMantenimientoComponent } from '../../../framework-comun/Medico/vista/medico-mantenimiento.component';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MedicoService } from '../../../framework-comun/Medico/servicio/medico.service';
import { dtoMedico } from '../../../framework-comun/Medico/dominio/dto/dtomedico';
import Swal from 'sweetalert2';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.scss']
})
export class MedicoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  @ViewChild(MedicoMantenimientoComponent, { static: false }) medicoMantenimientoComponent: MedicoMantenimientoComponent;
  segundos: number = 30;
  IdTimer: any;
  filtro: FiltroMedico = new FiltroMedico();
  especialidad: dtoMedico = new dtoMedico();
  lstMedico: SelectItem[] = [];
  lstespecialidad: SelectItem[] = [];
  editarCampos: boolean = false;
  lstEstado: SelectItem[] = [];
  loading: boolean;

  bloquearPag: boolean;
  first: number = 0;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  constructor(
    private toastrService: NbToastrService,
    private medicoService: MedicoService
  ) { super(); }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }



  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();

    // this.bloquearPagina();
    // this.grillaCargarDatos({ first: 0 });

    const p1 = this.comboCargarDatos();
    const p2 = this.cargarEstados();

    Promise.all([p1, p2]).then(
      f => {
        console.log("combitos::cargaditos::");
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
      });


    // this.desbloquearPagina();
  }

  cargarEstados() {
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstado.push({ label: 'Activo', value: 1 });
    this.lstEstado.push({ label: 'Inactivo', value: 2 });
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


  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == 'TIPMAAMEDICOEDIT') {
      console.log("data", mensage.resultado);
      if (!this.esNumeroVacio(mensage.resultado)) {
        console.log("Medico buscar TIPMAAMEDICOEDIT");
        this.coreBuscar();
      }
    }
  }

  coreNuevo(): void {
    this.openNew();
  }

  coreBuscar(): void {
    if (this.filtro.CMP == "") {
      this.filtro.CMP = null;
    }
    this.dataTableComponent.first = 0;
    this.grillaCargarDatos({ first: this.dataTableComponent.first });
  }

  validarTeclaEnter(evento) {

    if (evento.key == "Enter") {
      this.coreBuscar();

    }
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
    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAAMEDICO', ''), 'NUEVO');
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  invactivarProduct(product: any) {
    Swal.fire({
      title: '¡Mensaje!',
      text: '¡Desea inactivar Codigo: ' + product.CMP + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        product.Estado = 2;
        return this.medicoService.mantenimientoMaestro(3, product, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.toastMensaje(`El Registro Nro. ${product.CMP} fue inactivado`, 'success', 2000)
              this.dialog = false;
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: `${res.message}`
              })
            }
          }
        ).catch(error => error)
      }
    })

  }


  verProduct(rowdata: any) {

    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMANMEDICOVER', ''), "VER", rowdata);

  }

  editProduct(rowdata: any) {
    // this.dtoEditarAseguradora=rowdata;

    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAAMEDICOEDIT', ''), "EDITAR", rowdata);
  }

  grillaCargarDatos(event: LazyLoadEvent) {

    this.loading = true;
    this.filtro.MedicoId = -1;
    console.log("entrooo:::::");
    // this.bloquearPagina();
    this.medicoService.listarpaginado(this.filtro).then((res) => {
      // this.filtro.paginacion = res;
      var contado = 1;


      res.forEach(element => {
        element.numeromedico = contado++;        
        // this.lstMedico.push(element);
      });
      console.log("data listado:", res);
      this.loading = false;
      this.lstMedico = res;
      //this.desbloquearPagina();
    });
  }

  // comboCargarDatos(event: LazyLoadEvent) {
  //   console.log("entrooo:::al::combito");
  //   // this.bloquearPagina();
  //   this.medicoService.especialidadpaginado(this.especialidad).then((res) => {
  //     // this.filtro.paginacion = res;
  //     console.log("data listado combito:", res);

  //     this.lstMedico = res;

  //     res.forEach(e => {

  //       this.lstMedico.push({ label: e.nombre, value: e.codigo });

  //     });
  //     //this.desbloquearPagina();
  //   });
  // }

  comboCargarDatos(): Promise<number> {
    this.lstespecialidad.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.medicoService.especialidadpaginado(this.especialidad).then(resp => {
      console.log("Medico Maestre combo Procedencia:", resp);
      resp.forEach(e => {

        this.lstespecialidad.push({ label: e.Nombre, value: e.IdEspecialidad });

      });

      return 1;

    });

  }



}
