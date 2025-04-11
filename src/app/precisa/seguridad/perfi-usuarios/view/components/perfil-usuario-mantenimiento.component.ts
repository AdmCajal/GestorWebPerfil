import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { MessageService, SelectItem, TreeNode } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { AppSatate } from '../../../app.reducer';

import { NodePerfil } from '../../model/node-perfil';
import { Subscription } from 'rxjs';
import { PerfilUserService } from '../../service/produce.service';
import { Perfil } from '../../model/perfil';
import { MensajeController } from '../../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../../@theme/ConstanteAngular';
import { ConstanteUI } from '../../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-perfil-usuario-mantenimiento',
  templateUrl: './perfil-usuario-mantenimiento.component.html'
})
export class PerfilUsuarioMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {

  acciones: string = ''
  position: string = 'top'
  form: FormGroup;
  @Output() obtenerSecuencia = new EventEmitter()
  lstEstados: SelectItem[] = []
  perfiles: TreeNode[];
  perfilesAsignados: TreeNode[] = [];
  filtro: Perfil = new Perfil();
  dto: Perfil = new Perfil();
  nodePerfil: NodePerfil = new NodePerfil()
  dataArray: string[] = [];
  loading: boolean = false
  bloquearPag: boolean;
  selectedFiles: TreeNode;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  action: string;
  isNuevo:boolean=false;
  constructor(
    private store: Store<AppSatate>,
    private ProductService: PerfilUserService,
    private toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    private perfilUserService: PerfilUserService,
    private messageService: MessageService,) {
    super();
  }

  ngOnDestroy(): void {
    // this.perfilDetalle.unsubscribe()
  }


  ngOnInit(): void {
    this.buildForm();

    this.cargarEstados();

  }

  /*    VALIDATORS    */
  buildForm() {
    console.log("buildForm", this.form);
  }
  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {

    /**PARAMETROS */
    this.mensajeController = msj;
    this.action = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**OBJETOS */
    this.dto = new Perfil();

    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    await this.cargarEstados();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;
        this.isNuevo = false;
        await this.cargarAcciones(accion);

        this.fechaCreacion = new Date();
        this.fechaModificacion = null;
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        this.isNuevo = true;
        /**VALIDACION DE PERFIL MAESTRO */
        rowdata.perfil = rowdata.perfil.trim();
        if (rowdata.perfil == "WEBMASTER") {
          this.messageService.add({
            key: "bc",
            severity: "error",
            summary: "Aviso",
            detail: "El perfil WEBMASTER no puede ser editado.",
          });
          this.dialog = false;
          this.bloquearPag = false;
          return;
        }
        /**ASIGNAR OBJETO */
        this.cargarAcciones(accion, rowdata);

        /**FECHAS */
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        if (rowdata.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(rowdata.UltimaFechaModif);
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        this.isNuevo = true;
        /**ASIGNAR OBJETO */
        this.cargarAcciones(accion, rowdata);

        /**FECHAS */
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        if (rowdata.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(rowdata.UltimaFechaModif);
        }
        break;
    }
    this.bloquearPag = false;
  }

  cargarAcciones(accion: string, product?: any) {
    this.acciones = "Perfil Usuario: " + accion;
    this.dto = new Perfil();
    this.filtro.estado = "A";
    this.filtro.perfil = "WEBMASTER";
    this.ProductService.listarPerfilMaster(this.filtro).then(async (res) => {
      console.log("res[0].ListaPaginas", res[0].ListaPaginas);

      this.perfiles = res[0].ListaPaginas;
      this.bloquearPag = false;

      switch (accion) {
        case "NUEVO":
          this.dialog = true;
          this.puedeEditar = false;
          this.perfilesAsignados = [{
            label: "Comercial Web",
            data: "W1",
            expandedIcon: "pi pi-folder-open",
            collapsedIcon: "pi pi-folder"
          }];
          break;
        case "VER":
          this.dialog = true;
          this.puedeEditar = true;
          this.filtro = new Perfil();
          this.filtro.perfil = product.perfil;
          const respPerfilVer = await this.ProductService.listarPerfilMaster(this.filtro);
          this.dto = await respPerfilVer[0];
          this.dto.estado = this.dto.desestado;
          this.perfilesAsignados = this.dto.ListaPaginas;

          this.fechaCreacion = new Date(product.FechaCreacion);

          break;
        case "EDITAR":
          this.dialog = true;
          this.puedeEditar = false;
          this.filtro = new Perfil();
          this.filtro.perfil = product.perfil;
          const respPerfilEditar = await this.ProductService.listarPerfilMaster(this.filtro);
          this.dto = await respPerfilEditar[0];
          this.dto.estado = this.dto.desestado;
          this.perfilesAsignados = this.dto.ListaPaginas;
          console.log(" this.perfilesAsignados:", this.perfilesAsignados);

          this.fechaCreacion = new Date(product.FechaCreacion);

          break;
      }
      console.log("rowdata", product);

      // if (product.UltimaFechaModif == null || product.UltimaFechaModif == undefined) {
      //   this.fechaModificacion = undefined;
      // } else {
      //   this.fechaModificacion = new Date(product.UltimaFechaModif);
      // }
    });
  }

  coreBuscarPerfiles() {
    this.filtro.estado = "A";
    this.filtro.perfil = "WEBMASTER";
    this.ProductService.listarPerfilMaster(this.filtro).then((res) => {
      this.perfiles = res[0].ListaPaginas;
      console.log("EDITAR WEBMASTER", res[0]);

    });
  }
  stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });
    cache = null; // reset the cache
    return str;
  }

  saveProduct(event: Event) {

    /**VALIDACIONES */
    if (this.estaVacio(this.dto.perfil)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre de perfíl válido'); return; }
    if (this.estaVacio(this.dto.estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }
   if (this.perfilesAsignados[0].children == undefined) { this.messageShow('warn', 'Advertencia', 'Seleccione perfiles a asignar'); return; }
   if (this.perfilesAsignados[0].children != undefined) {
    if (this.perfilesAsignados[0].children.length == 0) { this.messageShow('warn', 'Advertencia', 'Seleccione perfiles a asignar'); return; }
   }
   if (this.perfilesAsignados[0].children.length != 0) {
      if (this.perfilesAsignados[0].children[0].children.length == 0) { this.messageShow('warn', 'Advertencia', 'Seleccione perfiles a asignar'); return; }
    }
    /**SI EL ARBOL TIENE UN NODO, SE VUELVE A VALIDAR LA RECURSIVIDAD */
    if (this.perfilesAsignados.length <= 0) { this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: "Seleccione opciones de menu." }); return; }
    this.lstEstados.forEach((e) => {
      if (e.value == this.dto.estado) {
        this.dto.desestado = e.label;
      }
    });

    event.preventDefault();
    /**CONVERSIÓN DE ARBOL EN JSON */
    this.dto.ListaPaginas = this.stringify(this.perfilesAsignados);
    console.log(" WEBMASTER", this.dto.ListaPaginas);

    this.bloquearPag = true;
    switch (this.action) {

      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        /**AUDITORIA */
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
        this.dto.FechaCreacion = new Date();
        this.dto.UltimaFechaModif = null;

        console.log("saveProduct NUEVO", this.dto)
        this.perfilUserService.mantenimientoPerfi(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.dto, this.getUsuarioToken()).
          then((res) => {
            console.log("res", res);
            if (res.success) {
              this.mensajeController.resultado = '';
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              // this.makeToast(this.getMensajeGrabado(this.dto.perfil.toUpperCase()));
              this.messageShow('success', 'success', this.getMensajeGuardado());
            } else {
              console.log(res);
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              this.messageShow('error', 'error', this.getMensajeErrorGuardado());
            }
          });

        break;

      case ConstanteUI.ACCION_SOLICITADA_EDITAR:

        /**AUDITORIA */
        this.dto.ultimousuario = this.getUsuarioAuth().data[0].Documento;
        this.dto.UltimaFechaModif = new Date();

        console.log("saveProduct EDITAR", this.dto)
        this.perfilUserService.mantenimientoPerfi(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dto, this.getUsuarioToken()).then(
          res => {
            this.dialog = false;

            console.log("registrado:", res);
            if (res.success) {
              this.mensajeController.resultado = '';
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              //this.makeToast(this.getMensajeActualizado(this.dto.perfil));
              this.messageShow('success', 'success', this.getMensajeActualizado());
            } else {
              this.messageShow('error', 'error', this.getMensajeErrorActualizar());
            }
          });
        break;
    }
    this.bloquearPag = false;
    this.dialog = false;
  }


  lineaGenerada: string
  generarSecuencia(): string {
    this.obtenerSecuencia.emit();
    return this.lineaGenerada
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }


  async cargarEstados(): Promise<boolean> {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Descripcion.toUpperCase(), value: i.Codigo })
    });
    console.log("lstEstados:", this.lstEstados);
    return true;
  }

  nodeSelect(event) {
    this.perfilesAsignados = null;
    console.log(event.node);
    this.perfilesAsignados = event.node;
  }




  checkNode(nodes: TreeNode[], str: string[]) {
    for (let i = 0; i < nodes.length; i++) {
      if (!nodes[i].leaf && nodes[i].children[0]?.leaf) {
        for (let j = 0; j < nodes[i].children?.length; j++) {
          if (str.includes(nodes[i].children[j].data)) {
            if (!this.nodePerfil.selectedPerfil_1.includes(nodes[i].children[j])) {
              nodes[i].expanded = true
              this.nodePerfil.selectedPerfil_1.push(nodes[i].children[j]);
            }
          }
        }
      }
      if (nodes[i].leaf) {
        return
      }
      this.checkNode(nodes[i].children, str);
      let count = nodes[i].children.length;
      let c = 0;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (this.nodePerfil.selectedPerfil_1.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected) {
          nodes[i].partialSelected = true;
          nodes[i].expanded = true
        }
      }
      if (c == 0) { }
      else if (c == count) {
        nodes[i].partialSelected = true;
        if (!this.nodePerfil.selectedPerfil_1.includes(nodes[i])) {
          this.nodePerfil.selectedPerfil_1.push(nodes[i]);
        }
      }
      else {
        nodes[i].partialSelected = true;
      }

    }
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  btnCerrar() {

    this.lstEstados = [];


    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }

}
