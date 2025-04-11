import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { FooterLoginComponent } from '../../../@theme/components';
import { Portal } from '../model/portal';
import { Sedes } from '../model/sedes';
import { RequestPasswordComponent } from '../request-password/request-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { LoginService } from '../service/login.service';
import * as CryptoJS from 'crypto-js';
import { ExamenService } from '../../framework-comun/Examen/servicio/Examen.service';
import { ParametrosService } from '../../maestros/Parametros/service/parametros.service';
import { filtroParametros } from '../../maestros/Parametros/model/filtro.parametros';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild(RequestPasswordComponent, { static: false }) recuperarClave: RequestPasswordComponent;
  @ViewChild(ResetPasswordComponent, { static: false }) resetClave: ResetPasswordComponent;
  @ViewChild(FooterLoginComponent, { static: false }) footer: FooterLoginComponent;

  hide = true;
  sedes: SelectItem[] = []
  loginForm: FormGroup
  objPortal: Portal = new Portal()
  portal: Portal = new Portal()
  listSedes: Sedes = new Sedes()
  filtroParame: filtroParametros = new filtroParametros()


  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private ParametrosService: ParametrosService,
    private examenService: ExamenService,
    private router: Router) { }

  ngOnInit(): void {
   sessionStorage.clear();
   localStorage.clear();
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.maxLength(50)]],
      clave: ['', [Validators.required, Validators.maxLength(100)]]
    })
    this.cargarServicios()
  }

  prueba() {
    this.loginService.prueba().then(
      res => console.log(res)
    )
  }

  get usuarioField() {
    return this.loginForm.get('usuario');
  }

  get passwordField() {
    return this.loginForm.get('clave');
  }

  get sedeField() {
    return this.loginForm.get('idSede');
  }


  login() {
    if (this.loginForm.valid) {
      Swal.fire({
        title: 'Espere por favor...',
        didOpen: () => {
          Swal.showLoading()
        }
      })
  
     // this.ListaPagina();

      let Frousuario = { 
        usuario: this.usuarioField.value,
        clave: this.passwordField.value,
        idSede:331
      }
      console.log("datos login", this.loginForm.value);
 
      return this.loginService.login2(Frousuario).then(
        res => {

          if (res.success) {
            let con = this.generarpsd();
            let auth = {
              success: res.success,
              data: res.data,
              tokem: res.tokem,
              valor: res.valor,
              mensaje: res.mensaje,
              encPass: CryptoJS.AES.encrypt(this.passwordField.value, con).toString(),
              encCon: btoa(con)
            };
            sessionStorage.setItem('access_user', JSON.stringify(auth));
            sessionStorage.setItem('access_user_token', JSON.stringify(res.tokem));
            let usuario = { usuario: this.usuarioField.value }
            this.listarMenu(usuario);
            this.listarMiscelaneos();
            this.listarParametros();
            this.mostrarIP();

          } else {
            console.log("login ops:::::", res);
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: res.mensaje
            })
          }
        }
      ).catch(error => {
        Swal.fire({
          icon: 'warning',
          title: '¡Lo sentimos!',
          text: 'Intentar mas tarde'
        })
      })
    } else {
      this.loginForm.markAllAsTouched();
    }

  }

  generarpsd() {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * 10));    //sorteo
    }
    return result;
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.login();
    }
  }

  recupearClave() {
    this.recuperarClave.iniciarComponente()
  }

  resetearClave() {
    this.resetClave.iniciarComponente()
  }

  cargarServicios() {
    const p1 = this.listarSedes()
    Promise.all([p1]).then(
      f => {

      }
    );
  }

  listarSedes(): Promise<number> {
    let sedes = { IdEmpresa: 75300, SedEstado: 1 }
    return this.loginService.listarSedes(sedes).then(
      sedes => {
        if (sedes.length > 0) {
          sedes.forEach(obj => this.sedes.push({ label: obj.SedDescripcion, value: obj.IdSede }));
          sessionStorage.setItem('access_sedes', JSON.stringify(sedes));
        }
        return 1
      }
    )
  }

 /*  ListaPagina() {  
    let proce = {  id: 1 } 
    console.log("Ingreso: ListaPagina", proce);  
    this.loginService.ListaMenu(proce).then(
        pagina => {
          console.log("Lista: ListaPagina", pagina);  
        }
      )

      let detall = {  id: 1,
                    Idpagina: 1
                  } 
      this.loginService.Listadetpagina(detall).then(
        detpagina => {
          console.log("Lista: Listadetpagina", detpagina);  
        }
    )
  }
   */


  listarCargarProcendia(){
    let procedencia = {  Estado: 1 }
    this.loginService.listarEspecialidad(procedencia).then(response => {
      Swal.close()
      if (response) {
        sessionStorage.setItem('access_Procendencia', JSON.stringify(response));
      } else {
        console.log("Error: Miscelaneos", JSON.stringify(response));
      }
    })
  }

  //cambios aqui tokem
  listarMenu(usuario: any) {
    this.loginService.listarMenu(usuario, this.loginService.usuarioGetToken()).then(response => {
      Swal.close()
      if (response) {
        console.log("menu lleno:", JSON.stringify(response));
        sessionStorage.setItem('access_menu', JSON.stringify(response));
        this.router.navigate(['/precisa'])
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Acceso Denegado'
        })
      }
    })
  }

  listarMiscelaneos() {
    let miscelaneos = { IdTablaMaestro: 0, IdCodigo: 0, Estado: 1 }
    this.loginService.listarMiscelaneos(miscelaneos).then(response => {
      Swal.close()
      if (response) {
        console.log("COMBOS MAESTROS:",response);
        sessionStorage.setItem('access_miscelaneos', JSON.stringify(response));
      } else {
        console.log("Error: Miscelaneos", JSON.stringify(response));
      }
    })
  }

  listarParametros() {
   // this.filtroParame.CompaniaCodigo="00000000";
    this.filtroParame.AplicacionCodigo="W1";
    this.filtroParame.Estado="A";
    this.ParametrosService.listarParametros(this.filtroParame).then((response) => {
      Swal.close()
      if (response) {
        console.log("COMBOS Parametros:",response);
        sessionStorage.setItem('access_Parametros', JSON.stringify(response));
      } else {
        console.log("Error: Miscelaneos", JSON.stringify(response));
      }
    })
  }



  mostrarIP() {
    var IP
    this.loginService.mostrarIp(IP).then((res) => {
      console.log("MOSTANDO IP", res)
      if (res) {
        sessionStorage.setItem('access_ip', JSON.stringify(res));
      } else {
        console.log("Error: IP", JSON.stringify(res));
      }

    });
  }


}
