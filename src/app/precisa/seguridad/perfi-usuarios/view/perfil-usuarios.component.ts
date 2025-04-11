import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { PerfilUsuiario } from '../model/perfil-usuario';
import * as actions from '../store/actions/perfil-usuario.actions';
import { AppSatate } from '../../app.reducer';
import { FormGroup } from '@angular/forms';
import { PerfilUsuarioMantenimientoComponent } from './components/perfil-usuario-mantenimiento.component';
import { MensajeController } from '../../../../../util/MensajeController';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { Perfil } from '../model/perfil';
import { PerfilUserService } from '../service/produce.service';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { IPerfilUsaurio } from '../model/iperfilusuario';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-perfil-usuarios',
  templateUrl: './perfil-usuarios.component.html',
  styleUrls: ['./perfil-usuarios.component.scss']
})
export class PerfilUsuariosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(PerfilUsuarioMantenimientoComponent, { static: false }) perfilesComponent: PerfilUsuarioMantenimientoComponent;
  @ViewChild(Table) dt: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  filtrosPerfil: PerfilUsuiario = new PerfilUsuiario();
  filtro: Perfil = new Perfil();

  bloquearPag: boolean;
  seguridad: boolean = false
  registroSeleccionado: any;
  dto: Perfil = new Perfil();
  products: PerfilUsuiario[] = [];
  lstVaEstado: SelectItem[] = [];
  lstPerfil: any[] = [];
  ltsExportar: MenuItem[];
  constructor(private store: Store<AppSatate>,
    private confirmationService: ConfirmationService,
    private perfilUserService: PerfilUserService,
    private toastrService: NbToastrService,
    private exportarService: ExportarService,
    private messageService: MessageService,) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_USUARIO") {
      this.coreBuscar();
    }

  }

  async ngOnInit() {
    const P1 = await this.cargarFuncionesIniciales()
    this.seguridad = true
    this.ltsExportar = [
      {
        label: "Formato PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          this.exportPdf();
        },
      },
      {
        label: "Formato EXCEL",
        icon: "pi pi-file-excel",
        command: () => {
          this.exportExcel();
        },
      },
    ];
    Promise.all([P1]).then((resp) => {

    });
    // this.listar()
  }

  coreBuscar(): void {

    if (this.filtro.perfil == "") {
      this.filtro.perfil = null;
    }

    if (this.filtro.estado == "") {
      this.filtro.estado = null;
    }

    console.log("llego filtro", this.filtro);
    this.bloquearPag = true;

    this.perfilUserService.listarPerfilMaster(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });

      this.lstPerfil = res;
      setTimeout(() => {
        this.bloquearPag = false;
      }, 500);
      console.log("consulta listarPerfilMaster:", this.lstPerfil);
    });

  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    this.limpiarFiltro()
  }

  cargarFuncionesIniciales() {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    this.cargarCombos()
  }

  onRowUnselect(event: any) {
    console.log("seleccion:", event);
    console.log("seleccion variable:", this.registroSeleccionado);
  }

  onRowSelect(event: any) {
    console.log("seleccion:", event);
    console.log("seleccion variable:", this.registroSeleccionado);
  }

  /*
  listar() {
      this.store.dispatch(actions.cargarLista())
      this.store.select('perfil').subscribe(PerfilUsuiario => {
        const items = [...PerfilUsuiario.perfiles];
        this.products = items
      })
    }
    */

  coreNuevo(): void {
    this.perfilesComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_USUARIO', ''), 'NUEVO', '', null);
  }

  coreVer(dto) {
    console.log("llego coreVer  ", dto);
    this.perfilesComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_USUARIO', ''), 'VER', '', dto);
  }

  coreEditar(dto) {
    console.log("llego coreEditar  ", dto);
    this.perfilesComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_USUARIO', ""), "EDITAR", "", dto)
  }
  async coreinactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm",
      accept: async () => {
        /**AUDITORIA*/
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.IpModificacion = this.getIp();
        dtoInactivar.estado = 'I';

        const respInactivar = await this.perfilUserService.mantenimientoPerfi(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.messageShow('success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
        }
      },
    });
  }

  exportExcel() {
    if (this.lstPerfil == null || this.lstPerfil == undefined || this.lstPerfil.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IPerfilUsaurio[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstPerfil.forEach(function (e: Perfil) {
        contador += 1;


        let itemExportar: IPerfilUsaurio = {
          NRO: contador.toString(),
          PERFIL: e.perfil?.toUpperCase() || '',
          ESTADO: e.estado?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstPerfil, listaExportar, "Perfiles de Usuario");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }

  //pdf

  exportPdf() {
    if (this.lstPerfil == null || this.lstPerfil == undefined || this.lstPerfil.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {

      var col = [[
        "NRO",
        "PERFIL",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstPerfil.forEach(function (e: Perfil) {
        contador += 1;
        // let fechaInicio = new Date(e.FechaApertura);
        // let dd = fechaInicio.getDate() <= 9 ? "0" + fechaInicio.getDate() : fechaInicio.getDate();
        // let mm = fechaInicio.getMonth() == 0 ? "01" : fechaInicio.getMonth() <= 9 ? "0" + fechaInicio.getMonth() : fechaInicio.getMonth() + 1;
        // let yyyy = fechaInicio.getFullYear()
        // fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador.toString(),
          e.perfil?.toUpperCase() || '',
          e.estado?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstPerfil, col, rows, "Perfiles_de_Usuario.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }


  deleteProduct(product: PerfilUsuiario) {
    this.confirmationService.confirm({
      message: 'Desea inactivar el perfil ' + product.Perfil + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(actions.inactivar({ id: product.tipousuario, estado: 'I' }))
        this.makeToast(this.getMensajeInactivado(product.tipousuario))
      }
    });
  }

  copyProduct(product: any) {
    this.confirmationService.confirm({
      message: 'Desea copiar el perfil ' + product.Perfil + '?',
      header: 'Confirm',
      icon: 'pi pi-copy',
      accept: () => {
        const perfil = { ...product };
        perfil.tipousuario = this.createId();
        this.store.dispatch(actions.copiar({ perfil }))
        this.makeToast(this.getMensajeCopiado(product.Perfil))
      }
    });
  }


  createId(): number {
    let tipousuario = 0
    let arrayNumber = this.products?.map(x => x.tipousuario)
    tipousuario = arrayNumber.length == 0 ? 100 : (Math.max(...arrayNumber) + 1)
    return tipousuario;
  }

  obtenerSecuencia(): string {
    let id = ''
    let arrayNumber = this.products?.map(x => x.tipousuario)
    id = arrayNumber.length == 0 ? "100" : (Math.max(...arrayNumber) + 1).toString()
    return this.perfilesComponent.lineaGenerada = id;
  }


  limpiarFiltro() {
    this.filtrosPerfil = new PerfilUsuiario()
    this.dt.filter('', 'tipousuario', 'contains')
    this.dt.filter('', 'Perfil', 'contains')
    this.dt.filter(null, 'VaEstado', 'contains')
  }

  cargarCombos() {
    this.lstVaEstado = [
      { value: null, label: '-- Todos --' },
      { value: 'A', label: 'Activo' },
      { value: 'I', label: 'Inactivo' },
    ];

  }

  /*    MENSAJES DE CONFIRMACIÓN    */
  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
