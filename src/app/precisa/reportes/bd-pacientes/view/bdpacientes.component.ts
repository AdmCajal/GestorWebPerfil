import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DtoAsistencia } from '../../../asistencia/Asistencia/model/DtoAsistencia';
import { AsistenciaService } from '../../../asistencia/Asistencia/service';



@Component({
  selector: 'ngx-bdpacientes',
  templateUrl: './bdpacientes.component.html',
  styleUrls: ['./bdpacientes.component.scss']
})
export class BdPacientesComponent implements OnInit {

  filtroAsistencia: DtoAsistencia = new DtoAsistencia();
  cantidad: number = 2023;

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

  constructor(
    private asistenciaService: AsistenciaService, 
    private cdr:ChangeDetectorRef) 
    { }

  ngOnInit(): void {
    this.bloquearPag = true
    const fechaActual: Date = new Date();
    fechaActual.setHours(0);
    fechaActual.setMinutes(0);
    fechaActual.setSeconds(0);
    this.filtroAsistencia.FechaCreacion = fechaActual;
    this.filtroAsistencia.FechaMarcacion = fechaActual;
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
    this.filtroAsistencia.FechaCreacion.setDate(1);
    this.filtroAsistencia.FechaCreacion.setMonth(1);
    this.corebuscar();
  }
  async corebuscar() {
    try {
      this.lstAsistencia.length = 0;
      this.loadingBtnBuscar = true;
      this.bloquearPag = true;
      this.lstAsistencia = await this.listarAsistencia(this.filtroAsistencia);
      console.log(this.lstAsistencia);

       this.calcularTotales();
      this.calcularRanking(); 
    } catch (error) {
      console.error('Error al buscar asistencia:', error);
    } finally {
      this.loadingBtnBuscar = false;
      this.bloquearPag = false;
      this.mostrarFiltros = false;
      this.primerGrafico();
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
      labels: ['INGRESOS', 'TARDANZAS', 'FALTAS'],
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

  primerGrafico() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

     let arrayCalculos = this.calculoDeHoras();

console.log(arrayCalculos);

    this.dataPrimerGrafico = {
      labels: ['> 07 Hr', '> 08 Hr', '> 09 Hr'],
      datasets: [
        {
          label: 'Ingreso',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: arrayCalculos.cantIngreso
        }
        // ,{
        //   label: 'Almuerzo',
        //   backgroundColor: documentStyle.getPropertyValue('--pink-500'),
        //   borderColor: documentStyle.getPropertyValue('--pink-500'),
        //   data: arrayCalculos.cantAlmuerzo
        // },
        // {
        //   label: 'Retorno',
        //   backgroundColor: documentStyle.getPropertyValue('--green-400'),
        //   borderColor: documentStyle.getPropertyValue('--green-400'),
        //   data: arrayCalculos.cantRetorno
        // },
        // {
        //   label: 'Salida',
        //   backgroundColor: documentStyle.getPropertyValue('--green-400'),
        //   borderColor: documentStyle.getPropertyValue('--green-400'),
        //   data: arrayCalculos.cantSalida
        // }
      ]
    };

    this.optionsPrimerGrafico = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
