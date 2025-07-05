import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { FormBuilder, Validators, } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { PersonaService } from '../../services/persona.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { ResponseApi } from '../../../../../../core/models/response/response.model';

@Component({
    selector: 'app-mantenimiento-persona',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-persona.component.html',
    styleUrls: ['./mantenimiento-persona.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoSucursal extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {
    @Output() override msjMantenimiento = new EventEmitter<any>();

    lstTipoPersonas: ComboItem[] = [];
    lstTipoDocumentos: ComboItem[] = [];
    lstSexos: ComboItem[] = [];

    lstDepartamentos: ComboItem[] = [];
    lstDistritos: ComboItem[] = [];
    lstProvincias: ComboItem[] = [];

    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
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

    override estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            IdAseguradora: [{ value: '', disabled: this.bloquearComponente }],
            IdPersona: [{ value: '', disabled: this.bloquearComponente }],
            TIPODOCUMENTO: [{ value: '', disabled: this.bloquearComponente }],
            ClasificadorMovimiento: [{ value: '', disabled: this.bloquearComponente }],
            SunatUbigeo: [{ value: '', disabled: this.bloquearComponente }],
            sunatubigeo: [{ value: '', disabled: this.bloquearComponente }],
            Persona: [{ value: '', disabled: this.bloquearComponente }],
            ApellidoPaterno: [{ value: '', disabled: this.bloquearComponente }],
            ApellidoMaterno: [{ value: '', disabled: this.bloquearComponente }],
            NombreCompleto: [{ value: '', disabled: this.bloquearComponente }],
            TipoDocumento: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            Documento: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            FechaNacimiento: [{ value: null, disabled: this.bloquearComponente }],
            TipoPaciente: [{ value: '', disabled: this.bloquearComponente }],
            Sexo: [{ value: '', disabled: this.bloquearComponente }],
            Sexo2: [{ value: '', disabled: this.bloquearComponente }],
            Nacionalidad: [{ value: '', disabled: this.bloquearComponente }],
            EstadoCivil: [{ value: '', disabled: this.bloquearComponente }],
            Direccion: [{ value: '', disabled: this.bloquearComponente }],
            Telefono: [{ value: '', disabled: this.bloquearComponente }],
            CorreoElectronico: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            Nombres: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            Celular: [{ value: '', disabled: this.bloquearComponente }],
            TipoPersona: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            TipoPersonac: [{ value: '', disabled: this.bloquearComponente }],
            DEPARTAMENTO: [{ value: '', disabled: this.bloquearComponente }],
            departamento: [{ value: '', disabled: this.bloquearComponente }],
            PROVINCIA: [{ value: '', disabled: this.bloquearComponente }],
            provincia: [{ value: '', disabled: this.bloquearComponente }],
            IngresoFechaRegistro: [{ value: null, disabled: this.bloquearComponente }],
            UltimaFechaModif: [{ value: null, disabled: this.bloquearComponente }],
            IngresoUsuario: [{ value: '', disabled: this.bloquearComponente }],
            UltimoUsuario: [{ value: '', disabled: this.bloquearComponente }],
            PerPerfilProfesional: [{ value: '', disabled: this.bloquearComponente }],
            Estado: [{ value: '', disabled: this.bloquearComponente }],
            EsCliente: [{ value: '', disabled: this.bloquearComponente }],
            EsEmpleado: [{ value: '', disabled: this.bloquearComponente }],
            EsProveedor: [{ value: '', disabled: this.bloquearComponente }],
            EsOtro: [{ value: '', disabled: this.bloquearComponente }],
            DocumentoFiscal: [{ value: '', disabled: this.bloquearComponente }],
            Edad: [{ value: '', disabled: true }],
            Edad2: [{ value: '', disabled: true }],
            PerTipoVia: [{ value: '', disabled: this.bloquearComponente }],
            PasswordWeb: [{ value: '', disabled: this.bloquearComponente }],
            DireccionReferencia: [{ value: '', disabled: this.bloquearComponente }],
            Comentario: [{ value: '', disabled: this.bloquearComponente }],
            DiaVencimiento: [{ value: '', disabled: this.bloquearComponente }],
            IndicadorRetencion: [{ value: '', disabled: this.bloquearComponente }],
            esIndicadorRetencion: [{ value: '', disabled: this.bloquearComponente }],
            TotalUbigeo: [{ value: '', disabled: this.bloquearComponente }],
            PersonaAnt: [{ value: '', disabled: this.bloquearComponente }],
            CodigoHC: [{ value: '', disabled: this.bloquearComponente }],
            CodAsegurado: [{ value: '', disabled: this.bloquearComponente }],
            DesTipoPersona: [{ value: '', disabled: this.bloquearComponente }],
            DescUbigeo: [{ value: '', disabled: this.bloquearComponente }],
            ipUltimo: [{ value: '', disabled: this.bloquearComponente }],
            tipoPersonaC: [{ value: '', disabled: this.bloquearComponente }]
        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTLETRAS'),
            tipoPersonas: this._MenuLayoutService.obtenerDataMaestro('TIPOPERSONA'),
            tipoDocumentos: this._MenuLayoutService.obtenerDataMaestro('TIPODOCIDENTID'),
            sexos: this._MenuLayoutService.obtenerDataMaestro('SEXO'),

            departamentos: this._PersonaService.obtenerUbigeo({ Num: 1 }),
        }).subscribe(resp => {
            this.lstTipoPersonas = [...resp.tipoPersonas];
            this.lstTipoDocumentos = [...resp.tipoDocumentos];
            this.lstEstados = [...resp.estados];
            this.lstSexos = [...resp.sexos];

            const dataDepartamentos = resp.departamentos?.data?.map((ele: any) => ({
                descripcion: ele.Nombre?.trim()?.toUpperCase() || "", codigo: ele.Codigo
            }));
            this.lstDepartamentos = [...dataDepartamentos];
        });
    }
    override obtenerDatosMantenimiento(): void { }
    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == AccionFormulario.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;
        console.log(valorAccionServicio)
        this._PersonaService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
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

    onCalcularEdad(): void {
        const fecha: Date = this.mantenimientoForm.get('FechaNacimiento')?.value;
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mes = hoy.getMonth() - fecha.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
            edad--;
        }
        this.mantenimientoForm.get('Edad')?.setValue(edad);
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
            this.lstDistritos = [...dataDistritos];
        });
    }
}
