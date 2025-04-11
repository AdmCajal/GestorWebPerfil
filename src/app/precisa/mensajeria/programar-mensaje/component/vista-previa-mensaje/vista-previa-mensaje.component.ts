import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../../util/UIMantenimientoController';
import { MensajeController } from '../../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../../util/Constantes/Constantes';
import { ProgramarMensajeService } from '../../services/programar-mensaje.service';
import { FiltroProgramacion } from '../../model/FiltroProgramacion';

@Component({
  selector: 'ngx-vista-previa-mensaje',
  templateUrl: './vista-previa-mensaje.component.html',
  styleUrls: ['./vista-previa-mensaje.component.scss']
})
export class VistaPreviaMensajeComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  /**VARIABLE DE BUSQUEDA */
  filtroProgramacion: FiltroProgramacion = new FiltroProgramacion();

  position: boolean;
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  accionDetalle: string = '';
  mensajeEnviarSMS: any = [
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "+51951178684",
      correo: "Geampier.dddd@gmail.com",
      tipo: "SMS",
      asunto: "",
      mensaje: "Esta pronto a vencer el pago de su letra Nro 17, tiene hasta el 10/06/2023 para realizar el pago. Ingrese a https://grupoltorres.com/ para ver su deuda."
    },
    {
      num: 1,
      persona: "Jordan Maeto Pizarro",
      telefono: "+51976361895",
      correo: "administrador@cajalsac.com",
      tipo: "SMS",
      asunto: "",
      mensaje: "Esta pronto a vencer el pago de su letra Nro 45, tiene hasta el 10/06/2023 para realizar el pago. Ingrese a https://grupoltorres.com/ para ver su deuda."
    }
  ];
  mensajeEnviarCorreo: any = [
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "",
      correo: "Geampier.smc@gmail.com",
      tipo: "CORREO",
      asunto: "",
      mensaje: "Hola Geampier Santamaría, nos comunicamos para informar que tiene un pago de letra atrasado, por favor acercarse a una de nuestras sedes y realizar su pago. Ingrese a https://grupoltorres.com/ para ver su deuda."
    },
    {
      num: 1,
      persona: "Jordan Maeto Pizarro",
      telefono: "+51976361895",
      correo: "administrador@cajalsac.com",
      tipo: "CORREO",
      asunto: "VENCIMIENTO DE PAGO DE LETRA",
      mensaje: "Hola Jordan Mateo, nos comunicamos para informar que tiene un pago de letra atrasado, por favor acercarse a una de nuestras sedes y realizar su pago. Ingrese a https://grupoltorres.com/ para ver su deuda."
    }
  ];
  constructor(private programarMensajeService: ProgramarMensajeService) { super(); }

  async coreIniciarComponente(msj: MensajeController, accion: string, dtoClassEgreso?: any) {


    //variables de entorno
    this.mensajeController = msj;
    this.acciones = accion;
    this.dialog = true;
    //auditoria
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
    this.fechaCreacion = new Date();
    this.fechaModificacion = undefined;
    this.bloquearPag = true;
    this.puedeEditar = false;
    // let filtroegresoDetalle: DtoEgreso = new DtoEgreso();
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        break;
    }
    this.bloquearPag = false;


  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    // const respBuscar = await this.programarMensajeService.ListarMensajeProgramacion()
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  async coreEnviar() {
    let resultadoEnvio = [];

    for (let mensajeEnviar of this.mensajeEnviarSMS) {
      const sms = {
        phone_number: mensajeEnviar.telefono,
        text: mensajeEnviar.mensaje
      }
      const respEnvio = await this.programarMensajeService.enviarMensajeTexto(sms);

      if (respEnvio.ok == true) {
        resultadoEnvio.push({
          persona: mensajeEnviar.persona,
          tipo: mensajeEnviar.tipo,
          envio: '✔️Correcto',
          resultado: respEnvio.message
        });
      } else
        if (respEnvio.ok == false) {
          resultadoEnvio.push({
            persona: mensajeEnviar.persona,
            tipo: mensajeEnviar.tipo,
            envio: '❌Incorrecto',
            resultado: respEnvio.message
          });
        }

    }
    const mensaje = `{
  "personalizations": [
      {
          "to": [
              {
                  "email": "analistadesarrollador@cajalsac.com"
              }
          ]
      }
  ],
  "from": {
      "email": "geampier.smc@gmail.com"
  },
  "subject": "Notificación de envio de mensaje",
  "content": [
      {
          "type": "text/plain",
          "value": "Se envio los mensajes programados de hoy: ${resultadoEnvio}"
      }
  ]
}`;
    const respEnvio = await this.programarMensajeService.enviarMensajeCorreo(mensaje);
    // const respEnvio = await this.programarMensajeService.enviarMensajeTexto()
    console.log(respEnvio);

  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

}
