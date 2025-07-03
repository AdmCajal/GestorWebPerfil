import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { PersonaService } from '../../../../../maestros/components/persona/services/persona.service';
import { v4 as uuidv4 } from 'uuid';
import { CompaniaService } from '../../../compania/services/compania.service';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { AplicativoService } from '../../../aplicativo/services/aplicativo.service';
import { ModuloAplicativo } from '../../../../../../core/models/interfaces/aplicativo/modulo.aplicativo';
import { SucursalService } from '../../../../../maestros/components/sucursal/services/sucursal.service';

@Component({
    selector: 'app-mantenimiento-perfil-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-perfil-usuario.component.html',
    styleUrls: ['./mantenimiento-perfil-usuario.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoPerfilUsuario extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {

    lstCompanias: ComboItem[] = [];
    lstSucursal: ComboItem[] = [];
    lstGerencia: ComboItem[] = [];
    lstCentroCosto: ComboItem[] = [];

    lstAplicativo: ComboItem[] = [];

    lstaplicativosSeleccionados: { Sistema: string, Nombre: string, modulos: ModuloAplicativo[] }[] = []

    aplicativoSeleccionado: { Sistema: string, Nombre: string, modulos: ModuloAplicativo[] } = { Sistema: '', Nombre: '', modulos: [] };
    codigoAplicativoAgregar: any;
    comentarioModulos: string = 'Seleccione un aplicativo asignado...';

    constructor(override _ActivatedRoute: ActivatedRoute,
        private _PerfilUsuarioService: PerfilUsuarioService,
        private _CompaniaService: CompaniaService,
        private _SucursalService: SucursalService,
        private _AplicativoService: AplicativoService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _SecurityService: SecurityService,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService); }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    override estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            empleadoBusqueda: [{ value: '', disabled: this.bloquearComponente }],
            PERSONA: [{ value: '', disabled: this.bloquearComponente }],
            USUARIO: [{ value: '', disabled: this.bloquearComponente }],
            NOMBRECOMPLETO: [{ value: '', disabled: true }],
            PERFIL: [{ value: '', disabled: this.bloquearComponente }],
            TipoUsuario: [{ value: '', disabled: this.bloquearComponente }],
            CorreoElectronico: [{ value: '', disabled: this.bloquearComponente }],
            Clave: [{ value: '', disabled: this.bloquearComponente }],
            contraseniaConfirmacion: [{ value: '', disabled: this.bloquearComponente }],
            ExpirarPasswordFlag: [{ value: '', disabled: this.bloquearComponente }],
            FechaExpiracion: [{ value: new Date(), disabled: this.bloquearComponente }],
            ESTADO: [{ value: '', disabled: this.bloquearComponente }],
            detallePerfiles: this._fb.array([])
        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            companias: this._CompaniaService.obtener({}),
            aplicativos: this._AplicativoService.obtenerAplicativos({}),
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: Number.parseInt(ele.codigo)
            }));
            this.lstEstados = [...dataEstados];

            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompanias = [...dataCompanias];

            const datAplicativos: any[] = resp.aplicativos?.data?.map((m: any) => ({ codigo: m.Sistema, descripcion: m.Nombre.trim() }));
            this.lstAplicativo = [...datAplicativos];
        });
    }

    override obtenerDatosMantenimiento(): void { }

    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == ACCION_FORMULARIO.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

        this._PerfilUsuarioService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
            tap((response: ResponseApi) => {
                if (response.success) {
                    this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
                    this.visualizarForm = false;
                    this.estructuraForm();
                    this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
                } else {
                    this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                }

            }), catchError((error) => {
                this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                return of(null);
            }),
            finalize(() => {
                this.bloquearComponente = false;
                this.barraBusqueda = false;
                this.mantenimientoForm.enable();
            })
        ).subscribe();

    }

    onAgregarAplicativoSeleccionado(): void {
        const item = this.lstAplicativo.find((item: any) => item.codigo === this.codigoAplicativoAgregar);

        if (item) {
            const aplicativoAgregar: any = { Sistema: item.codigo, Nombre: item.descripcion };
            const yaExiste = this.lstaplicativosSeleccionados.some((a: { Sistema: string, Nombre: string, modulos: ModuloAplicativo[] }) => a.Sistema === aplicativoAgregar.Sistema);

            if (yaExiste) {
                this.MensajeToastComun('notification', 'warn', 'Advertencia', 'El aplicativo ya fue agregado. No se permiten duplicados.');
            } else {
                this.lstaplicativosSeleccionados.unshift(aplicativoAgregar);
            }
        } else {
            this.MensajeToastComun('notification', 'warn', 'Advertencia', 'No se encontró el aplicativo al momento de agregar');
        }
    }
    onVerAplicativoSeleccionado(aplicativo: { Sistema: string, Nombre: string, modulos: ModuloAplicativo[] }): void {
        console.log(this.aplicativoSeleccionado);

        this.aplicativoSeleccionado = aplicativo;

        this.barraBusqueda = true;
        this.comentarioModulos = 'Buscando módulos de aplicativo...';
        this._AplicativoService.obtenerJerarquias({ Codigo: aplicativo.Sistema || '' }).pipe(
            tap((response: ResponseApi) => {
                if (response.success) {
                    this.aplicativoSeleccionado.modulos = [...response.data?.result];
                    if (this.aplicativoSeleccionado.modulos.length == 0) this.comentarioModulos = 'No se encontró información...';
                    this.MensajeToastComun('notification', 'success', 'Correcto', `${response.mensaje}`);

                } else {
                    this.comentarioModulos = 'No se encontró información...';
                    this.MensajeToastComun('notification', 'error', 'Error', `${response.mensaje}`); return;
                }

            }), catchError((error) => {
                this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                return of(null);
            }),
            finalize(() => {
                this.barraBusqueda = false;
            })
        ).subscribe();
    }

    btnObtenerSucursal(evento: any): void {
        this.lstSucursal = [];
        this.lstGerencia = [];
        this.lstCentroCosto = [];

        forkJoin({
            sucursales: this._SucursalService.obtener({ IdEmpresa: evento.value }),
        }).subscribe(resp => {
            const data = resp.sucursales?.data?.map((ele: any) => ({
                descripcion: ele.SedDescripcion?.trim()?.toUpperCase() || "", codigo: ele.SedCodigo
            }));
            console.log(data)
            this.lstSucursal = [...data];
        });
    }

}
