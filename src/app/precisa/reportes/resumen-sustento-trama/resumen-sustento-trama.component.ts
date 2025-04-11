import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DtoAsistencia } from '../../asistencia/Asistencia/model/DtoAsistencia';
import { AsistenciaService } from '../../asistencia/Asistencia/service';
import { FiltroContrato } from '../../ventas/Contrato/model/FiltroContrato';
import { ContratoService } from '../../ventas/Contrato/service/contrato.service';
import { dtoCantidad } from './model/dtoCantidad';
import { dtoMonto } from './model/dtoMonto';


@Component({
  selector: 'ngx-resumen-sustento-trama',
  templateUrl: './resumen-sustento-trama.component.html',
  styleUrls: ['./resumen-sustento-trama.component.scss']

})

export class ResumenSustentoTramaComponent implements OnInit {

  filtroAsistencia: DtoAsistencia = new DtoAsistencia();
  cantidad: number = 2023;

  CantProyec:     number = 0;
  CantLote:       number = 0;
  CantLoteLib:    number = 0;
  CantContrato:   number = 0;
  CantLetra:      number = 0;
  CantLetraPag:   number = 0;
  CantLetraAtra:  number = 0;



  totalMarcaciones: number = 0;
  totalPersonas: number = 0;
  Marcacionesingreso: number = 0;
  MarcacionesAlmuerzo: number = 0;
  MarcacionesRetorno: number = 0;
  MarcacionesSalida: number = 0;
  cantTardanzas: number = 0;
  cantFaltas: number = 0;
  pctjeTardanza: number = 0;

  dataPrimerGrafico: any;
  optionsPrimerGrafico: any;
  dataSegundoGrafico: any;
  optionsSegundoGrafico: any;
  dataTercerGrafico: any;
  optionsTercerGrafico: any;

  mostrarFiltros: boolean = false;
  loadingBtnBuscar: boolean = false;
  bloquearPag: boolean = false;

  lstAsistencia: DtoAsistencia[] = [];
  lstAsistenciaRanking: any[] = [];

  filtroCon: FiltroContrato = new FiltroContrato();
  filCantidad: dtoCantidad = new dtoCantidad();
  filMonto: dtoMonto = new dtoMonto();
  lstContrato: any[] = [];
  lstMonto: any[] = [];


  constructor(
    private asistenciaService: AsistenciaService, 
    private contratoService: ContratoService,
    private cdr:ChangeDetectorRef) 
    { }

  ngOnInit(): void {
    this.bloquearPag = true
    const fechaActual: Date = new Date();
    var rraño = fechaActual.getFullYear();
    fechaActual.setFullYear(rraño);
    fechaActual.setDate(1);
    fechaActual.setMonth(0);
    fechaActual.setHours(0);
    fechaActual.setMinutes(0);
    fechaActual.setSeconds(0);
    this.filtroAsistencia.FechaCreacion = fechaActual;  

    const FechaModificacion: Date = new Date();
    FechaModificacion.setHours(0);
    FechaModificacion.setMinutes(0);
    FechaModificacion.setSeconds(0);

    this.filtroCon.FechaCreacion = fechaActual;
    this.filtroCon.FechaModificacion = FechaModificacion;
  //  this.filtroCon.FechaMarcacion = FechaModificacion;
    this.corebuscar();
    this.bloquearPag = false;



  }

  async listarAsistencia(filtroAsistencia: DtoAsistencia): Promise<DtoAsistencia[]> {
    try {
      let respAsistencia: DtoAsistencia[] = await this.asistenciaService.listarAsistencia(filtroAsistencia);
      return respAsistencia;
    } catch (error) {
      console.log(`error al buscar asistencias: ${error}`);
      return [];
    }
  }

  probar() {
    this.filtroCon.FechaCreacion.setDate(1);
    this.filtroCon.FechaCreacion.setMonth(1);
    this.corebuscar();
  }

  async corebuscar() {
    try {
      this.lstAsistencia.length = 0;
      this.loadingBtnBuscar = true;
      this.bloquearPag = true;

      this.contratoService.ReporteEstadisticoCantidad(this.filtroCon).then((res) => {
        this.bloquearPag = false;
        console.log('this.filCantidad:',res);
        var pctjeLetraAtra: number = 0; 
        res.forEach((element) => {
          this.CantProyec     = element.CantProyec;
          this.CantLote       = element.CantLote;
          this.CantLoteLib    = element.CantLoteLib;
          this.CantContrato   = element.CantContrato;
          this.CantLetra      = element.CantLetra;
          this.CantLetraPag   = element.CantLetraPag;
          pctjeLetraAtra      = element.CantLetraAtra;  
          this.CantLetraAtra  = element.CantLetraAtra; 
        });
        this.CantLetraAtra = (pctjeLetraAtra * 100) / this.CantLetra;
        this.lstContrato = res;
      })

      this.contratoService.ReporteEstadisticoMonto(this.filtroCon).then((res) => {
        this.bloquearPag = false;
        console.log(' this.lstMonto :',res);
        this.lstMonto = res;
        this.generarDatosGrafico();
      })

/*       this.lstAsistencia = await this.listarAsistencia(this.filtroAsistencia);
      console.log(this.lstAsistencia);

       this.calcularTotales();
      this.calcularRanking();  */
    } catch (error) {
      console.error('Error al buscar asistencia:', error);
    } finally {
      this.loadingBtnBuscar = false;
      this.bloquearPag = false;
      this.mostrarFiltros = false;
  
      this.segundoGrafico(); 
      this.cdr.detectChanges();    
    }
  }


  calcularTotales() {
    if (this.lstAsistencia.length > 0) {
      this.totalMarcaciones = this.lstAsistencia.length;
      this.totalPersonas = this.lstAsistencia.reduce((acc, obj) => { if (!acc.includes(obj.nombrecompleto)) { acc.push(obj.nombrecompleto); } return acc; }, []).length;
      this.Marcacionesingreso = this.lstAsistencia.filter(x => x.TipoMarcacion === "IN").length;
      this.MarcacionesAlmuerzo = this.lstAsistencia.filter(x => x.TipoMarcacion === "AL").length;
      this.MarcacionesRetorno = this.lstAsistencia.filter(x => x.TipoMarcacion === "AF").length;
      this.MarcacionesSalida = this.lstAsistencia.filter(x => x.TipoMarcacion === "SA").length;

      this.cantTardanzas = this.lstAsistencia.filter(x => new Date(x.FechaMarcacion).getHours() > 9 && x.TipoMarcacion == "IN").length;
      this.pctjeTardanza = (this.cantTardanzas * 100) / this.Marcacionesingreso;
      this.cantFaltas = this.lstAsistencia.filter(x => x.TipoMarcacion === "FA").length;
      
    }
  }

  calcularRanking() {
    if (this.lstAsistencia.length > 0) {
      const personasAntesDe9AM = this.lstAsistencia.filter((persona) => {
        const fechaMarcacion = new Date(persona.FechaMarcacion);
        const horaMarcacion = fechaMarcacion.getHours();
        const minutosMarcacion = fechaMarcacion.getMinutes();
        const segundosMarcacion = fechaMarcacion.getSeconds();
        return (horaMarcacion < 9 || (horaMarcacion === 9 && minutosMarcacion === 0 && segundosMarcacion === 0));
      }).sort((personaA, personaB) => {
        const fechaMarcacionA = new Date(personaA.FechaMarcacion);
        const fechaMarcacionB = new Date(personaB.FechaMarcacion);
        if (fechaMarcacionA < fechaMarcacionB) {
          return -1;
        } else if (fechaMarcacionA > fechaMarcacionB) {
          return 1;
        } else {
          return 0;
        }
      }).reduce((result, persona) => {
        const nombreCompleto = persona.nombrecompleto.trim();
        result[nombreCompleto] = (result[nombreCompleto] || 0) + 1;
        return result;
      }, {});

      const resultado = Object.entries(personasAntesDe9AM).map(([nombre, cantidad]) => { return { nombre, cantidad }; });
      console.log(resultado);
      this.lstAsistenciaRanking = [...resultado];
    }
  }

  segundoGrafico() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dataSegundoGrafico = {
      labels: ['CUOTA', 'INTERES', 'EGRESOS'],
      datasets: [
        {
          data: [this.Marcacionesingreso, this.cantTardanzas, this.cantFaltas],
          backgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--red')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--red')]
        }
      ]
    };

    this.optionsSegundoGrafico = {
      cutout: '100%',
      aspectRatio: 0.89999999,
      plugins: {
        legend: {
          labels: {
            color: textColor
          },

        }
      }
    };
  }

  calculoDeHoras(): any {
    let cantIngreso = [
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 7
          && new Date(x.FechaMarcacion).getHours() < 8
          && x.TipoMarcacion === "IN").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 8
          && new Date(x.FechaMarcacion).getHours() < 9
          && x.TipoMarcacion === "IN").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 9
          && new Date(x.FechaMarcacion).getHours() < 10
          && x.TipoMarcacion === "IN").length
    ];
    let cantAlmuerzo = [
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 7
          && new Date(x.FechaMarcacion).getHours() < 8
          && x.TipoMarcacion === "AL").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 8
          && new Date(x.FechaMarcacion).getHours() < 9
          && x.TipoMarcacion === "AL").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 9
          && new Date(x.FechaMarcacion).getHours() < 10
          && x.TipoMarcacion === "AL").length
    ];
    let cantRetorno = [
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 7
          && new Date(x.FechaMarcacion).getHours() < 8
          && x.TipoMarcacion === "AF").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 8
          && new Date(x.FechaMarcacion).getHours() < 9
          && x.TipoMarcacion === "AF").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 9
          && new Date(x.FechaMarcacion).getHours() < 10
          && x.TipoMarcacion === "AF").length
    ];
    let cantSalida = [
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 7
          && new Date(x.FechaMarcacion).getHours() < 8
          && x.TipoMarcacion === "SA").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 8
          && new Date(x.FechaMarcacion).getHours() < 9
          && x.TipoMarcacion === "SA").length,
      this.lstAsistencia
        .filter(x => new Date(x.FechaMarcacion).getHours() >= 9
          && new Date(x.FechaMarcacion).getHours() < 10
          && x.TipoMarcacion === "SA").length
    ];


    console.log("cantIngreso", cantIngreso);

    return {
      cantIngreso: cantIngreso,
      cantAlmuerzo: cantAlmuerzo,
      cantRetorno: cantRetorno,
      cantSalida: cantSalida
    };
  };

  generarDatosGrafico() {
    const labels = this.lstMonto.map(proyecto => proyecto.Nombre);
    const sumContratoData = this.lstMonto.map(proyecto => proyecto.SumContrato);
    const sumLetraPagData = this.lstMonto.map(proyecto => proyecto.SumLetraPag);
    const sumLetraAtraData = this.lstMonto.map(proyecto => proyecto.SumLetraAtra);
  
    this.dataPrimerGrafico = {
      labels: labels,
      datasets: [
        {
          label: 'SumContrato',
          backgroundColor: '#42A5F5',
          data: sumContratoData
        },
        {
          label: 'SumLetraPag',
          backgroundColor: '#66BB6A',
          data: sumLetraPagData
        },
        {
          label: 'SumLetraAtra',
          backgroundColor: '#FFA726',
          data: sumLetraAtraData
        }
      ]
    };
    console.log('dataPrimerGrafico :',this.dataPrimerGrafico);
    this.optionsPrimerGrafico = {
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      },
      plugins: {
        legend: {
          position: 'top',
        }
      }
    };

  }


}
