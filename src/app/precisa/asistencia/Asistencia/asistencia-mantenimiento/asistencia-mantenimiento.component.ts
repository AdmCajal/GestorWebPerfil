import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MensajeController } from '../../../../../util/MensajeController';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { DtoAsistencia } from '../model/DtoAsistencia';
import {GMapModule} from 'primeng/gmap';
import { AsistenciaService } from '../service';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';


@Component({
  selector: 'ngx-asistencia-mantenimiento',
  templateUrl: './asistencia-mantenimiento.component.html'
})

export class AsistenciaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = '';
  position: string = "top";
  puedeEditar: boolean = false;
  dto: DtoAsistencia = new DtoAsistencia();
  options: any;
  lstTipoAsistencia: SelectItem[] = [];
  overlays: any[];
  mostrar: boolean;
  latitud: number;
  longitud: number;
  lugar: string;

  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;
  zoom: number = 16;
  public markers: any[] = [];
  constructor(
    private messageService: MessageService,
    private personaService: PersonaService,
    private asistenciaService: AsistenciaService
  ) {
    super();
  }

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.cargarTipoAsistencia();
    if (this.validarform == "NUEVO") {
      this.mostrar = false;
      this.dto = new DtoAsistencia();
      this.dto.FechaMarcacion = new Date();
      this.dto.documento = this.getUsuarioAuth().data[0].Documento.trim();
      this.dto.nombrecompleto = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.dto.Empleado = this.getUsuarioAuth().data[0].Persona;
      this.dto.TipoMarcacion = 'IN';

      // let ubicacion:any = this.asistenciaService.getuserLocation();
      //  let ubi:any = this.asistenciaService.userLocation;

      let ubi: any;

      const p0 = this.asistenciaService.getuserLocation();

      Promise.all([p0]).then(async (resp) => {

        ubi = this.asistenciaService.userLocation;


        //console.log("ubicacion", ubicacion);
        console.log("ubi", ubi);

        if (!this.esListaVacia(ubi)) {
          //this.longitud = ubi[0];
          this.longitud = ubi[0];
          //this.latitud  = ubi[1];  
          this.latitud = ubi[1];
          this.lugar = await this.asistenciaService.getDistrictFromCoordinates(this.latitud ,this.longitud);
          console.log("ubicacion array", this.latitud, this.longitud,this.lugar);
          this.dto.Latitud = this.latitud.toString();
          this.dto.Longitud = this.longitud.toString();
          this.dto.LugarMarcacion = this.lugar;
        }
        // if (this.esListaVacia(ubi)) {
        // }else{
        // }  
        console.log("entro iniciarComponenteMaestro:", msj);

      });

    } else if (this.validarform == "VER") {
      this.mostrar = true;
      console.log("VER rowdata :", rowdata);
      this.dto = rowdata;
      this.dto.FechaMarcacion = new Date(this.dto.FechaMarcacion);
      this.latitud = Number(rowdata.Latitud);
      this.longitud = rowdata.Longitud;
      this.lat = Number(rowdata.Latitud);
      this.lng = Number(rowdata.Longitud);
      console.log("VER rowdata center :", this.longitud, this.latitud);

      this.options = {
        center: { lat: this.latitud, lng: this.longitud }
      };
      this.markers.push({
        center: {
          lat: this.latitud,
          lng: this.longitud
        },
        label: {
          color: "black",
          text: this.dto.area_desc
        }
      });
      console.log("VER rowdata overlays:", this.overlays);
    }
  }

 obtenerLog(){
  var onUbicacionConcedida;
  var onError;
  var opciones;
  var s = navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onError, opciones);

console.log(s);

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     // La posición se obtiene exitosamente
  //     var latitude = position.coords.latitude;
  //     var longitude = position.coords.longitude;
  //     console.log("Latitud: " + latitude + ", Longitud: " + longitude);
  //   }, function(error) {
  //     // Ocurrió un error al obtener la posición
  //     console.error("Error al obtener la posición: " + error.message);
  //   });
  // } else {
  //   // Geolocalización no es compatible en el navegador
  //   console.error("Geolocalización no es compatible");
  // }
 }

   cargarTipoAsistencia(){
    this.lstTipoAsistencia = [];
    this.lstTipoAsistencia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPASI").forEach(i => {
      this.lstTipoAsistencia.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
    console.log("lstTipoAsistencia",this.lstTipoAsistencia);
    
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarTipoAsistencia();
    Promise.all([p1]).then((resp) => {

    });
  }

  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }
  coreBuscar(): void {
    throw new Error("Method not implemented.");
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error("Method not implemented.");
  }
  coreExportar(tipo: string): void {
    throw new Error("Method not implemented.");
  }
  coreSalir(): void {
    throw new Error("Method not implemented.");
  }

  coreGuardar() {
    // if (this.estaVacio(this.dto.documento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de comprobante válido'); return; }
    // if (this.estaVacio(this.dto.nombrecompleto)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de comprobante válido'); return; }
    if (this.estaVacio(this.dto.TipoMarcacion)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de asistencia válido'); return; }


    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
      this.dto.FechaCreacion = new Date();
      this.dto.FechaCreacion.setHours(this.dto.FechaCreacion.getHours()-5);
      this.dto.FechaMarcacion = new Date();
      this.dto.FechaMarcacion.setHours(this.dto.FechaMarcacion.getHours()-5);
      this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.dto.Estado = 'A'; // estado activo al registrar
      console.log("antes de enviar:", this.dto);
      this.asistenciaService.mantenimientoAsistencia(1, this.dto, this.getUsuarioToken()).then(
        res => {
          console.log(res);

          this.dialog = false;
          this.bloquearPag = false;
          console.log("despues de enviar:", this.dto);
          console.log("registrado:", res);

          if (res.Empleado != null) {
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
            this.mensajeController.resultado = res;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          } else {
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Error al grabar asistencia.' });
          }
        });
    }

  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
