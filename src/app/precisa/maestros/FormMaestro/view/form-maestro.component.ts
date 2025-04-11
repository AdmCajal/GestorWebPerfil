import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ConfirmationService,  SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { FiltroMaestro } from '../model/Filtro.Maestro';
import { MaestroService } from '../service/maestro.service';
import { FormMaestroMantenimientoComponent } from './components/form-maestro-mantenimiento.component';
import { Maestro } from '../model/maestro';
import { UsuarioAuth } from '../../../auth/model/usuario';
import Swal from 'sweetalert2';
import { MensajeController } from '../../../../../util/MensajeController';

@Component({
  selector: 'ngx-form-maestro',
  templateUrl: './form-maestro.component.html',
  styleUrls: ['./form-maestro.component.scss']
})
export class FormMaestroComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(FormMaestroMantenimientoComponent, { static: false }) maestroComponent: FormMaestroMantenimientoComponent;

  filtro: FiltroMaestro = new FiltroMaestro();
  bloquearPag: boolean;
  lstEstado: SelectItem[] = [];
  ltsExportar: SelectItem[] = [];
  lstMaestros: any[] = [];
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  @Input() bloquear = false;

 

  constructor(
    // private formBuilder: FormBuilder,
    private maestroService: MaestroService,
    private toastrService: NbToastrService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) { super(); }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.maestroComponent.iniciarComponente("NUEVO", );
  }

  coreBuscar(): void { 
    this.cargarListaMaestro();
  }

  exportExcel(): void {
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
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarEstados()
    Promise.all([p1]).then( f => {

      }
    );
  }


  cargarEstados() {
    this.lstEstado.push({ label: "Seleccione", value: null });
    this.lstEstado.push({ label: 'Activo', value: 1 });
    this.lstEstado.push({ label: 'Inactivo', value: 2 });
  }


  cargarListaMaestro() {
    this.bloquearPag = true;
    this.maestroService.listarMaestro(this.filtro).then(
      res => {
        this.bloquearPag = false;
        this.lstMaestros = res;
        console.log("res", res);
      }
    )
  }


  openNew() {
   // this.maestroComponent.iniciarComponente('NUEVO')


  }

  editProduct(product: Maestro) {
    this.maestroComponent.iniciarComponente('EDITAR', product)
  }

  verProduct(product: Maestro) {
    this.maestroComponent.iniciarComponente('VER', product)
    console.log("ver:::: rowdata" + product)
  }

  invactivarProduct(product: Maestro) {
    this.confirmationService.confirm({
      message: 'Desea inactivar Codigo: ' + product.CodigoTabla + '?',
      header: 'Confirm', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        product.Estado = 2;
        this.maestroService.mantenimientoMaestro(3, product, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.makeToast(this.getMensajeInactivado(product.CodigoTabla))
              this.dialog = false;
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${res.message}`
              })
            }
          }
        ).catch(error => error)
      }
    });
  }

  /*    MENSAJES DE CONFIRMACIÓN    */
  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

}
