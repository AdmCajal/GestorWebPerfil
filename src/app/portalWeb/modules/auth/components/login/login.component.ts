import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../layout/component/app.floatingconfigurator';
import { LayoutService } from '../../../../../layout/service/layout.service';
import { AuthService } from '../../auth.service';
import { MessageService } from 'primeng/api';
import { SecurityService } from '../../../../security/services/Security.service';
import { ConfigService } from '../../../../security/services/config.service';
import { catchError, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { NotificacionesSweet } from '../../../../core/utils/notificaciones-sweet';
import { ResponseApi } from '../../../../core/models/response/response.model';
import { ComponentesCompartidosModule } from '../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { MenuLayoutService } from '../../../../core/services/menu.layout.service';
import { Menu } from '../../../../core/models/interfaces/menu/menu';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ComponentesCompartidosModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService]
})
export class Login extends NotificacionesSweet implements OnInit, OnDestroy {
    LoginForm: FormGroup;
    msgLogin: string;
    usuarioLogin: any;
    bloquearComponente = false;

    imagenesConfig: any = {};
    coloresConfig: any = {};

    fondoLogin: string;
    lstSociedades: any[];

    constructor(
        private _fb: FormBuilder,
        private layoutService: LayoutService,
        private router: Router,
        private _AuthService: AuthService,
        private _messageService: MessageService,
        private _menuLayoutService: MenuLayoutService,
        private _SecurityService: SecurityService,
        private _configService: ConfigService,
        private renderer: Renderer2,
        private el: ElementRef,
        private titleService: Title
    ) {
        super();

        this.fondoLogin = '';
        this.msgLogin = '';
        this.LoginForm = new FormGroup({});
        this.lstSociedades = [];
        this.configuracionInicialFormulario();
        this.titleService.setTitle(`.: Iniciar Sesión - ${this.titleService.getTitle()}`);
    }
    ngOnDestroy(): void {
    }

    ngOnInit(): void {

        this.obtenerUsuarioGuardado();
        this.ObtenerDatosSelect();

        this.estructuraForm();
    }

    estructuraForm(): void {
        this.LoginForm = this._fb.group({
            correo: [{ value: '', disabled: this.bloquearComponente }, [Validators.required],],
            contrasenia: [{ value: '', disabled: this.bloquearComponente }, [Validators.required],]
        });
    }

    MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
        this._messageService.clear();
        this._messageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    }

    ObtenerDatosSelect(): void {
        // this._AuthService.obtenerSociedades().subscribe(res => {
        //     this.lstSociedades = res.response.map(item => { return { code: item.codigoSociedad, name: item.nombreSociedad } });
        // });
    }

    configuracionInicialFormulario(): void {
        forkJoin({
            imagenes: this._configService.imagenesConfig(),
            colores: this._configService.coloresConfig()
        }).pipe(
            tap(({ imagenes, colores }) => {
                this.imagenesConfig = imagenes.login;
                this.coloresConfig = colores.login;
                this.fondoLogin = this.imagenesConfig.tipoback == 'image' ? `background-image: url('${this.imagenesConfig.background}')` : `background-color: ${this.imagenesConfig.background} !important`;
                const div = this.el.nativeElement.querySelector('.bg-Formulario');
                this.renderer.setStyle(div, 'border-radius', '56px');
                this.renderer.setStyle(div, 'background', this.coloresConfig.backgroundFormulario + ' !important');
                document.styleSheets[0].insertRule(
                    `.important-background { background: ${this.coloresConfig.backgroundFormulario} !important; }`,
                    document.styleSheets[0].cssRules.length);
            }),
            catchError(error => {
                console.error(`Error al obtener la configuración de formulario login. ${error}`);
                return of(error);
            })
        ).subscribe();
    }

    btnIniciarSesion(): void {
        this.bloquearComponente = true;
        this.LoginForm.disable();

        const { correo, contrasenia } =
            this.LoginForm.value;

        const usuarioLogin = {
            Usuario: correo,
            Clave: contrasenia,
        };

        this._AuthService.iniciarSesion(usuarioLogin).pipe(
            switchMap((validacionResponse: ResponseApi) => {
                if (!validacionResponse.success) {

                    this.MensajeSweet('Acceso Incorrecto', validacionResponse.mensaje, 'error');
                    this._SecurityService.cerrarSesion();
                    return of(validacionResponse);
                } else {
                    this._SecurityService.guardarLogin(validacionResponse);
                    this._SecurityService.guardarUsuarioLogueado(validacionResponse.data);
                    this.obtenerDatosMaestros();
                    return this._AuthService.obtenerMenuUsuario(usuarioLogin);
                }
            }),
            tap((loginResponse: ResponseApi) => {

                if (!loginResponse?.success) {
                    this.msgLogin = loginResponse.message;
                    this._SecurityService.cerrarSesion();

                } else if (loginResponse.success) {

                    let response: any = loginResponse.data;
                    const menuFormato: Menu[] = response.map((m: any) => (
                        {
                            titulo: m.DescripcionGrupo,
                            ordenModulo: m.DescripcionGrupo,
                            nombre: m.DescripcionPaginas,
                            url: m.URL.replace("Comercial", "").replace(".aspx", ""),
                            nivelModulo: m.ORDEN,
                            status: m.Estado,
                            estado: m.Estado,
                            id_menu: m.AplicacionCodigo + m.Grupo + m.Concepto,
                            icono: 'pi pi-building-columns'
                        }
                    ));
                    console.log(response)
                    console.log(menuFormato)
                    this._menuLayoutService.guardarMenu(menuFormato);
                    this._menuLayoutService.guardarMenuCredencialesOrdenadas();

                    location.reload();
                }
            }), catchError((error) => {
                if(error.message.includes('Http failure response')){
                    this.MensajeToastComun('notification', 'error', 'Sin respuesta de inicio de sesión', 'Hubo un problema de conexión. Por favor, verifica tu red e inténtalo nuevamente.');
                }else{
                    this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                }
                console.error(`Error al iniciar sesión. ${JSON.stringify(error)}`);
                return of(null);
            }),
            finalize(() => {
                this.bloquearComponente = false;
                this.LoginForm.enable();
            })
        ).subscribe();
    }

    obtenerDatosMaestros(): void {
        this.bloquearComponente = true;
        this.LoginForm.disable();

        this._AuthService.obtenerDatosMaestros().pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {
                    this._menuLayoutService.guardarDataMaestro(consultaRepsonse.data);
                    // this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);
                    return;
                }
            }), catchError((error) => {
                this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                console.error(`Error al buscar maestros. ${error}`);
                return of(null);
            }),
            finalize(() => {
                this.bloquearComponente = false;
                this.LoginForm.enable();
            })
        ).subscribe();
    }
    /**
     * Obtiene el usuario guardado en el localStorage
     */
    obtenerUsuarioGuardado(): void {
        try {
            const savedCredentials = this._AuthService.obtenerCredenciales();
            if (savedCredentials !== null) {
                this.usuarioLogin = { ...savedCredentials };
            }
        } catch (error) {
            this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
            console.error('Error al obtener usuario.', error);
        }
    }
}
