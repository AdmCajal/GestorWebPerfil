import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { catchError, debounceTime, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { LogModificacionesComponent } from '../../../../../../shared/components/log-modificaciones-component/log-modificaciones-component';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { CompaniaService } from '../../services/compania.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { PersonaService } from '../../../../../maestros/components/persona/services/persona.service';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';

@Component({
    selector: 'app-mantenimiento-compania',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-compania.component.html',
    styleUrls: ['./mantenimiento-compania.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoCompania extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {

    lstEmpresaBusqueda: any[] = [];
    lstRepresentanteBusqueda: any[] = [];
    lstDepartamentos: ComboItem[] = [];
    lstDistritos: ComboItem[] = [];
    lstProvincias: ComboItem[] = [];

    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
        private _CompaniaService: CompaniaService,
        private _PersonaService: PersonaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService); }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            EmpRucBusqueda: [{ value: '', disabled: this.bloquearComponente }],
            EmpRazonSocialBusqueda: [{ value: '', disabled: true }],
            DocumentoFiscalBusqueda: [{ value: '', disabled: this.bloquearComponente }],
            RepresentanteLegalBusqueda: [{ value: '', disabled: true }],

            CompaniaCodigo: [{ value: '', disabled: this.bloquearComponente }],
            DescripcionCorta: [{ value: '', disabled: this.bloquearComponente }],
            DescripcionLarga: [{ value: '', disabled: this.bloquearComponente }],
            DireccionComun: [{ value: '', disabled: this.bloquearComponente }],
            DireccionAdicional: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            FechaFundacion: [{ value: '', disabled: this.bloquearComponente }],
            Telefono1: [{ value: '', disabled: this.bloquearComponente }],
            Telefono2: [{ value: '', disabled: this.bloquearComponente }],
            Telefono3: [{ value: '', disabled: this.bloquearComponente }],
            Fax1: [{ value: '', disabled: this.bloquearComponente }],
            Fax2: [{ value: '', disabled: this.bloquearComponente }],
            DocumentoFiscal: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            PropietarioPorDefecto: [{ value: '', disabled: this.bloquearComponente }],

            DescripcionExtranjera: [{ value: '', disabled: this.bloquearComponente }],
            MonedaPorDefecto: [{ value: '', disabled: this.bloquearComponente }],
            TipoCompania: [{ value: '', disabled: this.bloquearComponente }],
            FactorRValidacion: [{ value: '', disabled: this.bloquearComponente }],
            AfectoIGVFlag: [{ value: '', disabled: this.bloquearComponente }],
            CreditoFiscalFactorFlag: [{ value: '', disabled: this.bloquearComponente }],
            CuentaProvisionSBSFlag: [{ value: '', disabled: this.bloquearComponente }],
            LogoFile: [{ value: '', disabled: this.bloquearComponente }],
            Persona: [{ value: null, disabled: this.bloquearComponente }, [Validators.required]],
            personadesc: [{ value: '', disabled: this.bloquearComponente }],

            RepresentanteLegal: [{ value: '', disabled: this.bloquearComponente }],
            PaginaWeb: [{ value: '', disabled: this.bloquearComponente }],
            CertificadoInscripcion: [{ value: '', disabled: this.bloquearComponente }],
            AfectoRetencionIGVFlag: [{ value: '', disabled: this.bloquearComponente }],
            DetraccionCuentaBancaria: [{ value: '', disabled: this.bloquearComponente }],
            Estado: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            ESTADOdesc: [{ value: '', disabled: this.bloquearComponente }],
            RepresentanteLegalDocumento: [{ value: '', disabled: this.bloquearComponente }],
            Grupo: [{ value: '', disabled: this.bloquearComponente }],
            RegimenLaboralRTPS: [{ value: '', disabled: this.bloquearComponente }],
            CIIU: [{ value: '', disabled: this.bloquearComponente }],
            Ubigeo: [{ value: '', disabled: this.bloquearComponente }],
            DescripcionPSF: [{ value: '', disabled: this.bloquearComponente }],
            CodigoAnterior: [{ value: '', disabled: this.bloquearComponente }],
            RUC: [{ value: '', disabled: this.bloquearComponente }],

            CodDep: [{ value: 0, disabled: this.bloquearComponente }],
            CodPro: [{ value: 0, disabled: this.bloquearComponente }],
            CodDis: [{ value: 0, disabled: this.bloquearComponente }],
        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTLETRAS'),
            departamentos: this._PersonaService.obtenerUbigeo({ Num: 1 }),
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: ele.codigo
            }));
            this.lstEstados = [...dataEstados];

            const dataDepartamentos = resp.departamentos?.data?.map((ele: any) => ({
                descripcion: ele.Nombre?.trim()?.toUpperCase() || "", codigo: ele.Codigo
            }));
            this.lstDepartamentos = [...dataDepartamentos];
        });
    }

    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == ACCION_FORMULARIO.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

        this.mantenimientoForm.get('Grupo')?.setValue(this.mantenimientoForm.get('CodDep')?.value + "" + this.mantenimientoForm.get('CodPro')?.value + "" + this.mantenimientoForm.get('CodDis')?.value);

        this._CompaniaService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
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
    btnBuscarEmpresa(campo: string): void {
        this.mantenimientoForm
            .get(campo)
            ?.valueChanges.pipe(
                debounceTime(1000),
                switchMap(res => {
                    if (res.length >= 0) {
                        if (res.length == 0) {
                            this.mantenimientoForm.get('Persona')?.setValue('');
                            this.mantenimientoForm.get('personadoc')?.setValue('');
                            this.mantenimientoForm.get('DescripcionCorta')?.setValue('');
                        }
                        const filtroForm = {
                            Documento: res.trim(),
                            tipopersona: "J", // Juridica
                            TipoDocumento: "R", // RUC
                            Estado: "A" // Activo
                        }
                        return this._PersonaService.obtener(filtroForm);
                    }
                    return [];
                })
            )
            .subscribe((responseApi) => {
                this.lstEmpresaBusqueda = [];
                const dataResponse: any[] = responseApi.data;
                if (dataResponse.length > 0) {
                    const dataFormato = dataResponse.map(res => {
                        return {
                            ...res,
                            visible: res.Documento.trim() + ' - ' + res.NombreCompleto.trim(),
                        }
                    });
                    this.lstEmpresaBusqueda = [...dataFormato];
                }
            });


    }
    btnBuscarRepresentante(campo: string): void {
        this.mantenimientoForm
            .get(campo)
            ?.valueChanges.pipe(
                debounceTime(1000),
                switchMap(res => {
                    if (res.length >= 0) {
                        if (res.length == 0) {
                            this.mantenimientoForm.get('DocumentoFiscal')?.setValue('');
                            this.mantenimientoForm.get('RepresentanteLegal')?.setValue('');
                        }
                        const filtroForm = {
                            Documento: res.trim(),
                            tipopersona: "N", //Natural
                            SoloBeneficiarios: "0",
                            UneuNegocioId: "0"
                        }
                        return this._PersonaService.obtener(filtroForm);
                    }
                    return [];
                })
            )
            .subscribe((responseApi) => {
                this.lstRepresentanteBusqueda = [];
                const dataResponse: any[] = responseApi.data;
                if (dataResponse.length > 0) {
                    const dataFormato = dataResponse.map(res => {
                        return {
                            ...res,
                            visible: res.NombreCompleto || `${res[0].Nombres}, ${res[0].ApellidoPaterno}`,
                        }
                    });
                    this.lstRepresentanteBusqueda = [...dataFormato];
                }
            });


    }
    btnObtenerProvincia(evento: any): void {
        this.lstProvincias = [];
        this.lstDistritos = [];

        forkJoin({
            provincias: this._PersonaService.obtenerUbigeo({ Num: 2, Codigo: evento.value }),
        }).subscribe(resp => {
            const dataProvincias = resp.provincias?.data?.map((ele: any) => ({
                descripcion: ele.Nombre?.trim()?.toUpperCase() || "", codigo: ele.Codigo
            }));
            console.log(dataProvincias)
            this.lstProvincias = [...dataProvincias];
        });
    }
    btnObtenerDistritos(evento: any): void {
        this.lstDistritos = [];

        forkJoin({
            distritos: this._PersonaService.obtenerUbigeo({ Num: 3, Codigo: this.mantenimientoForm.get('CodPro')?.value + evento.value }),
        }).subscribe(resp => {
            const dataDistritos = resp.distritos?.data?.map((ele: any) => ({
                descripcion: ele.Nombre?.trim()?.toUpperCase() || "", codigo: ele.Codigo
            }));
            console.log(dataDistritos)
            this.lstDistritos = [...dataDistritos];
        });
    }

    onEmpresaSeleccionado(evento: any): void {
        this.mantenimientoForm.get('Persona')?.setValue(evento.value.Persona);
        this.mantenimientoForm.get('personadoc')?.setValue(evento.value.Documento);
        this.mantenimientoForm.get('DescripcionCorta')?.setValue(evento.value.NombreCompleto);

        this.mantenimientoForm.get('EmpRucBusqueda')?.setValue({ visible: evento.value.Documento });
        this.mantenimientoForm.get('EmpRazonSocialBusqueda')?.setValue({ visible: evento.value.NombreCompleto });
    }
    onRepresentanteSeleccionado(evento: any): void {
        this.mantenimientoForm.get('DocumentoFiscal')?.setValue(evento.value.Documento);
        this.mantenimientoForm.get('RepresentanteLegal')?.setValue(evento.value.NombreCompleto);

        this.mantenimientoForm.get('DocumentoFiscalBusqueda')?.setValue({ visible: evento.value.Documento });
        this.mantenimientoForm.get('RepresentanteLegalBusqueda')?.setValue({ visible: evento.value.NombreCompleto });
    }
}
