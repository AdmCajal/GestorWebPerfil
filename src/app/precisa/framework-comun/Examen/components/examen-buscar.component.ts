import { Component, OnInit, ViewChild } from "@angular/core";
import { timeStamp } from "console";
import { LazyLoadEvent, MessageService, SelectItem } from "primeng/api";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { AdmisionServicio, Cliente, TipoOperacion } from "../../../admision/consulta/dominio/dto/DtoConsultaAdmision";
import { FiltroCliente, FiltroTipoOperacion } from "../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { convertDateStringsToDates } from "../../../framework/funciones/dateutils";
import { FiltroExamen, FiltroServicio } from "../dominio/filtro/FiltroExamen";
import { ExamenService } from "../servicio/Examen.service";




@Component({
    selector: 'ngx-examen-buscar',
    templateUrl: './examen-buscar.component.html'
})

export class ExamenBuscarComponent extends ComponenteBasePrincipal implements OnInit {
    @ViewChild(Table, { static: false }) dataTableComponent: Table;

    Auth: UsuarioAuth = new UsuarioAuth();

    cliente: FiltroCliente = new FiltroCliente();
    servicio: FiltroServicio = new FiltroServicio();
    filtro: FiltroTipoOperacion = new FiltroTipoOperacion();
    lstcliente: SelectItem[] = [];
    lstServicio: SelectItem[] = [];
    lstTipoOperacion: SelectItem[] = [];
    lstexamen: SelectItem[] = [];
    lstModeloServicio: SelectItem[] = [];
    dtoAdminservice: AdmisionServicio = new AdmisionServicio();
    validarAccion: string;
    parentSelector: boolean = false;
    filtroexamen: FiltroExamen = new FiltroExamen();
    loading: boolean;
    registroSeleccionado: any;
    constructor(
        protected messageService: MessageService,
        private consultaAdmisionService: ConsultaAdmisionService,
        private examenService: ExamenService) {
        super();
    }

    titulo = '';
    acciones: string = ''
    position: string = 'top'
    dialog: boolean = false;
    page1: boolean = false;
    page2: boolean = false;
    pageCliente1: boolean = false;
    pageCliente3: boolean = false;

    init(): void {

    }

    ngOnInit(): void {
        const p2 = this.comboCargarServicios();
        console.log("Busqueda Examen  coreIniciar::", p2)
        Promise.all([p2]).then(resp => {
            console.log("Busqueda Examen  ngOnInit::", p2)
        });
    }

    iniciarComponente(accion: string, titulo) {
        this.dialog = true;
        this.cargarAcciones(accion, titulo)
    }

    coreIniciarComponente(msj: MensajeController, dtoEditExamen?: any) {
        this.dialog = true;
        this.mensajeController = msj;
        this.filtroexamen = dtoEditExamen;
    }

    async coreIniciarComponenteBuscar(mensaje: MensajeController, accionform: string, page: number, dtoEditExamen?: any): Promise<void> {
        console.log("Busqueda Examen  coreIniciarComponenteBuscar::", page)
        this.limpiarExamen();
        this.dialog = true;
        this.mensajeController = mensaje;
        this.titulo = 'EXAMEN';
        this.acciones = `${this.titulo}: ${accionform}`;
        this.validarAccion = accionform;
        console.log("Busqueda Examen  coreIniciar::", page)
        if (accionform == "BUSCAR") {
            if (page == 1) {
                this.page1 = true
                this.page2 = false
                this.pageCliente1 = true
                this.pageCliente3 = false
                await this.comboCargarCliente(1);
                this.filtroexamen.empresa = dtoEditExamen.comboCliente;               
                this.filtroexamen.ClasificadorMovimiento = dtoEditExamen.ClasificadorMovimiento;
                // this.comboCargarTipoOperacion(1, dtoEditExamen.TipoOperacionID);
                this.comboPerfil(dtoEditExamen.TipoOperacionID);
                this.filtroexamen.TipoOperacionID = dtoEditExamen.tipoOperacionId;
            } else if (page == 2) {
                console.log("dtoEditExamen::", dtoEditExamen)
                this.page1 = false
                this.page2 = true
                this.pageCliente1 = true
                this.pageCliente3 = false
                await this.comboCargarCliente(2);
                this.filtroexamen.empresa = dtoEditExamen.empresa;
                this.filtroexamen.ClasificadorMovimiento = dtoEditExamen.ClasificadorMovimiento;
                // this.comboCargarTipoOperacion(2, dtoEditExamen.TipoOperacionID)
                this.comboPerfil(dtoEditExamen.TipoOperacionID)
                this.filtroexamen.TipoOperacionID = dtoEditExamen.tipoOperacionId;
            } else if (page == 3) {
                console.log("dtoEditExamen::", dtoEditExamen)
                this.page1 = true
                this.page2 = false
                this.pageCliente1 = false
                this.pageCliente3 = true;

                await this.comboCargarCliente(3);
                this.filtroexamen.empresa = dtoEditExamen.Persona;
                this.filtroexamen.ClasificadorMovimiento = dtoEditExamen.ClasificadorMovimiento;
                // this.comboCargarTipoOperacion(3, dtoEditExamen.TipoOperacionID)
                this.comboPerfil(dtoEditExamen.TipoOperacionID)
                this.filtroexamen.TipoOperacionID = dtoEditExamen.tipoOperacionId;
            }
        } else {
            this.filtroexamen = mensaje.componenteDestino.dtoEditExamen;
        }
    }

    comboCargarCliente(page): Promise<number> {
        if (page == 1) {
            var listaComboliente = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('comboCliente')));
            listaComboliente.forEach(e => {
                this.lstcliente.push({ label: e.empresa, value: e.Persona });
                this.filtroexamen.empresa = listaComboliente[0].Persona;
            });
            console.log("Buscar Examen combo cliente Temp", listaComboliente);
        }
        else if (page == 3) {
            this.lstcliente = [];
            this.cliente.TipEstado = 1;
            this.cliente.TIPOADMISIONID = 3;
        }
        else {
            this.cliente.TipEstado = 1;
            this.cliente.TIPOADMISIONID = 2;
        }
        if (page != 1) {
            this.lstcliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
            return this.consultaAdmisionService.listarcombocliente(this.cliente).then(resp => {
                resp.forEach(e => {
                    if (page == 3) {
                        this.filtroexamen.txtempresa = resp[0].empresa;
                    }
                    else {
                        this.lstcliente.push({ label: e.empresa, value: e.Persona });
                    }
                });
                return 1;
            });
        }
    }

    comboCargarServicios(): Promise<number> {
        this.servicio.Estado = 1;
        this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        return this.examenService.serviciopaginado(this.servicio).then(resp => {
            resp.forEach(e => {
                this.lstServicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
            });
            console.log("Busqueda Examen comboCargarServicios::", resp);
            return 1;
        });
    }


    comboCargarTipoOperacion(page: number = 0, tipoOperacionId: number = 0): Promise<number> {
        console.log("Busqueda Examen ::", page);
        if (page == 2) {
            this.Auth = this.getUsuarioAuth();
            var operation = this.Auth.data;
            this.filtro.UneuNegocioId = operation[0].UneuNegocioId;
            this.filtro.TipoOperacionID = tipoOperacionId
            this.lstTipoOperacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
            return this.examenService.listarModeloServicio(this.filtro).then(resp => {
                resp.forEach(e => {
                    this.lstTipoOperacion.push({ label: e.MosDescripcion, value: e.TipoOperacionId });
                });
                this.filtroexamen.TipoOperacionID = tipoOperacionId;
                console.log("Busqueda Examen comboCargarTipoOperacion::", resp);
                return 1;
            });
        } else if (page == 2) {
            this.filtro.TipEstado = 1;
            this.filtro.TIPOADMISIONID = 3;
            this.lstTipoOperacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
            return this.consultaAdmisionService.listarcombotipooperacion(this.filtro).then(resp => {
                resp.forEach(e => {
                    this.lstTipoOperacion.push({ label: e.Descripcion, value: e.TipoOperacionID });
                });
                this.filtroexamen.TipoOperacionID = tipoOperacionId;
                console.log("Busqueda Examen comboCargarTipoOperacion ::", resp);
                console.log("Busqueda Examen TopoOperacionID", this.filtroexamen.TipoOperacionID);
                return 1;

            });
        }
    }

    comboPerfil(tipoOperacionId: number = 0): Promise<number> {
        this.lstTipoOperacion = []
        var filtro
        filtro = {
            UneuNegocioId: this.getUsuarioAuth().data[0].UneuNegocioId,
            MosEstado: 1,
            TipoOperacionID: tipoOperacionId
        }  
        this.lstTipoOperacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        return this.consultaAdmisionService.listarModeloServicio(filtro).then(resp => {
            resp.forEach(e => {
                this.lstTipoOperacion.push({ label: e.MosDescripcion, value: e.TipoOperacionId });
            });
            console.log("Busqueda Examen  comboPerfil", resp)
            this.filtroexamen.ModeloServicioId = resp[0].ModeloServicioId;
            this.filtroexamen.TipoOperacionID = tipoOperacionId;
            return 1;

        });



    }


    cargarAcciones(accion: string, titulo) {
        this.acciones = `${titulo}: ${accion}`;
        this.dialog = true;
        this.puedeEditar = false;
    }

    coreBuscar(): void {
        if (this.filtroexamen.Descripcion == "") {
            this.filtroexamen.Descripcion = null;
        }
        if (this.filtroexamen.CodigoComponente == "") {
            this.filtroexamen.CodigoComponente = null;
        }
        this.dataTableComponent.first = 0;
        this.grillaCargarDatos({ first: this.dataTableComponent.first });
    }

    grillaCargarDatos(event: LazyLoadEvent) {
        this.loading = true;
        // this.bloquearPagina();
        this.filtroexamen.Estado = 1;
        // this.filtroexamen.TipoOperacionID = 340;
        // this.filtroexamen.ModeloServicioId = 215;
        console.log("cabecera", this.filtroexamen);
        this.examenService.examenpaginado(this.filtroexamen).then((res) => {
            // this.filtro.paginacion = res;
            console.log("table res examen ::", res)
            var contado = 1;
            res.forEach(element => {
                element.numeroExamen = contado++;
            });
            this.loading = false;
            this.lstexamen = res;
            //this.desbloquearPagina();
        });
    }

    validarTeclaEnter(evento) {
        if (evento.key == "Enter") {
            this.coreBuscar();
        }
    }


    ondobleRowDblclick(rowData: any) {
        console.log("seleccion variable:", rowData);
        // this.mensajeController.resultado = dto;        
        // this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);

    }

    coreSalir() {
        this.dialog = false;
    };

    limpiarExamen() {
        this.registroSeleccionado = null;
        this.filtroexamen.Descripcion = null;
        this.filtroexamen.CodigoComponente = null;
        this.lstexamen = [];
        this.loading = false;
    }

    coreSeleccionar(dto: any) {
        dto = this.registroSeleccionado;
        console.log("seleccion variable:", dto);
        if (dto === null) {
            this.mostrarMensajeInfo('Debe seleccionar un registro');
            return;
        } else {
            this.mensajeController.resultado = dto;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);

            this.coreSalir();
        }
    }

    esCodigoExamenValido(event) {
        if (this.filtroexamen.ClasificadorMovimiento != "04") {
            let key;
            if (event.type === 'paste') {
                key = event.clipboardData.getData('text/plain');
            } else {
                key = event.keyCode;
                key = String.fromCharCode(key);
            }
            const regex = /[0-9]|\./;
            if (!regex.test(key)) {
                event.returnValue = false;
                if (event.preventDefault) {
                    event.preventDefault();
                }
            }
        }
    }

    mostrarMensajeInfo(mensaje: string): void {
        this.mostrarMensaje(mensaje, 'info');
    }

    mostrarMensaje(mensaje: string, tipo: string): void {
        this.messageService.clear();
        this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
    }

    checkboxSeleccionar() {

        //   var checkboxes = document.querySelectorAll("input[type = 'checkbox']");
        //   console.log(checkboxes)
        //   function checkAll(myCheckbox){
        //       if(myCheckbox.checked == true){
        //           console.log("checkbox true")
        //           checkboxes.forEach(function(checkbox){
        //             this.checkbox.checked = true;
        //           });
        //       }
        //       else{
        //           checkboxes.forEach(function(checkbox){
        //             console.log("checkbox false")
        //               this.checkbox.checked = false;
        //           })
        //       }
        //   }
    }

    // checkAll($event) {
    //     var id: any = 0;
    //     var checkboxes = document.querySelectorAll("input[type = 'checkbox']");
    //     var checkbox = document.querySelectorAll("input[value='rowData.numeroExamen']");
    //     var select: any = true;
    //     const numeroExamen = $event.target.value;
    //     const isChecked = $event.target.checked;
    //     console.log(numeroExamen, isChecked);

    //     this.lstexamen = this.lstexamen.map((d) => {

    //         if (checkbox == numeroExamen) {
    //             checkboxes = isChecked;
    //             return d;

    //         }
    //         // if(this.parentSelector == true){
    //         //     this.rowSelector = true;

    //         //     return d;
    //         // }else{
    //         //     this.rowSelector = false;
    //         // }
    //         if (numeroExamen == -1) {
    //             this.parentSelector;
    //             return d;
    //         }

    //         console.log(d);
    //         return d;

    //     });


    //     //   this.onRowSelect((d)=>{
    //     //     if(id == -1){
    //     //     d = this.rowSelector =  true;
    //     //     return d;
    //     //     }return d;
    //     //   });

    // }

}