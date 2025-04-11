import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ProgramaMantenimientoComponent } from '../component/programa-mantenimiento/programa-mantenimiento.component';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { ProgramarMensajeService } from '../services/programar-mensaje.service';
import { FiltroProgramacion } from '../model/FiltroProgramacion';
import { Dtoprogramacion } from '../model/DtoProgramacion';

@Component({
  selector: 'ngx-programar-mensaje',
  templateUrl: './programar-mensaje.component.html',
  styleUrls: ['./programar-mensaje.component.scss']
})
export class ProgramarMensajeComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(ProgramaMantenimientoComponent, { static: false }) programaMantenimientoComponent: ProgramaMantenimientoComponent;

  /**FILTRO Y LISTA DE GRILLA */
  filtroProgramacion: FiltroProgramacion = new FiltroProgramacion();
  lstProgramaciones: Dtoprogramacion[] = [];
  bloquearPag: boolean = false;
  ltsExportar: any[];
  lstPersonasEnviar: any[] = [
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684"
    },
  ];
  checked = true;
  puedeEditar: boolean = false;
  file: any = null;
  nombreArchivo: string;
  lstEstados: SelectItem[];
  lstTipoMensaje: SelectItem[];

  ngAfterContentInit(): void {
    this.cargarEstado();
    this.cargarTipoMensaje();
  }
  constructor(private messageService: MessageService, private programarMensajeService: ProgramarMensajeService) { super(); }

  coreNuevo(): void {
    this.programaMantenimientoComponent.coreIniciarComponente(new MensajeController(this, 'SELECT_PROGRAMACION', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO);
  }
  coreEditar(programacion: Dtoprogramacion): void {
    this.programaMantenimientoComponent.coreIniciarComponente(new MensajeController(this, 'SELECT_PROGRAMACION', ''), ConstanteUI.ACCION_SOLICITADA_EDITAR, programacion);
  }
  coreVer(programacion: Dtoprogramacion): void {
    this.programaMantenimientoComponent.coreIniciarComponente(new MensajeController(this, 'SELECT_PROGRAMACION', ''), ConstanteUI.ACCION_SOLICITADA_VER, programacion);
  }
  async coreBuscar() {
    this.bloquearPag = true;
    try {
      this.lstProgramaciones = [];
      const respBuscar = await this.programarMensajeService.ListarMensajeProgramacion(this.filtroProgramacion);
      console.log("FiltroProgramacion", respBuscar);
      respBuscar.forEach(programacion => {
        programacion.num = this.lstProgramaciones.length + 1;
        this.lstProgramaciones.push(programacion);
      });

    let  fechaCreacion: Date;
        fechaCreacion = new Date();
      let objApp = { Fecha: fechaCreacion,
        Estado: 1 }
      const respApp= await this.programarMensajeService.ListarMensajeApp(objApp);
      console.log("respApp", respApp);

    } catch (error) {
      this.lstProgramaciones.length = 0;
      console.log('ERROR AL BUSCAR::', error);
    } finally {
      this.bloquearPag = false;
      this.lstProgramaciones = [...this.lstProgramaciones];
    }
    console.log("FiltroProgramacion", this.lstProgramaciones);
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {

  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }
  exportExcel(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
  }

  limpiarLstPersonas(): void {
    this.nombreArchivo = null;
  }
  exportar(event: any, ubicacion: number) {
    console.log('exportar evento', event.target);
    const img = event.target.files;
    const reader = new FileReader();
    if (img[0].type.split("/")[0] != 'image') {
      this.messageShow('warn', 'Advertencia', 'El archivo no es una imagen.');
      if (ubicacion == 1) { this.nombreArchivo = null; } return;
    }
    if (img[0].size > 1048576) {
      this.messageShow('warn', 'Advertencia', 'El archivo es demasiado grande.');
      if (ubicacion == 1) { this.nombreArchivo = null; } return;
    }

    reader.onloadend = () => {
      let base = reader.result as string;
      if (ubicacion == 1) {
        this.nombreArchivo = img[0].name;
        // img[0].type;
        // base.split('base64,')[1];
      }
    };
    reader.readAsDataURL(img[0]);
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  cargarEstado(): void {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }
  cargarTipoMensaje(): void {
    this.lstTipoMensaje = [];
    this.lstTipoMensaje.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPREP").forEach(i => {
      this.lstTipoMensaje.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }


}

