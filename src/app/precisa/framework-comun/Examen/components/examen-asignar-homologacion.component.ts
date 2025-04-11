import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { FiltroPacienteClinica } from "../../../admision/paciente-clinica/dominio/filtro/FiltroPacienteClinica";
import { EmpresaBuscarComponent } from "../../Empresa/view/empresa-buscar.component";
import { PersonaService } from "../../Persona/servicio/persona.service";



@Component({
    selector: 'ngx-examen-asignar-homologacion',
    templateUrl: './examen-asignar-homologacion.component.html'
})
export class ExamenAsignarHomologacionComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
    @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
    editarCampoEmpresa: boolean = false;
    editarCampos: boolean = false;
    filtro: FiltroPacienteClinica = new FiltroPacienteClinica();

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    acciones: string = ''
    position: string = 'top'


    constructor(
        private personaService: PersonaService

    ) {
        super(

        );
    }

    coreMensaje(mensage: MensajeController): void {
        if (mensage.componente == "SELECEMPRESA") {
            if (mensage.resultado.DocumentoFiscal != null) {
                this.filtro.Documento = mensage.resultado.DocumentoFiscal;
            } else {
                this.filtro.Documento = mensage.resultado.Documento;
            }
            this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
            this.filtro.Persona = mensage.resultado.Persona;

            this.editarCampoEmpresa = true;
            console.log("selec empresa", mensage.resultado)

            // console.log("datoscombo",mensage.resultado.Persona)
        }
    }
    coreNuevo(): void {
        throw new Error("Method not implemented.");
    }
    coreBuscar(): void {
        throw new Error("Method not implemented.");
    }
    coreGuardar(): void {
        throw new Error("Method not implemented.");
    }

    coreExportar(tipo: string): void {
        throw new Error("Method not implemented.");
    }
    coreSalir(): void {
        throw new Error("Method not implemented.");
    }

    verSelectorEmpresa(): void {
        // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
        this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
    }

    iniciarComponente(accion: string, titulo) {

        // if (accion) {
        this.cargarAcciones(accion, titulo)
        // }
    }



    cargarAcciones(accion: string, titulo) {

        this.acciones = `${titulo}: ${accion}`;
        this.dialog = true;
        this.puedeEditar = false;

    }

    limpiarEmpresa() {
        this.filtro.Documento = null;
        this.filtro.NombreCompleto = null;
        this.editarCampoEmpresa = false;
    }

    validarTeclaEnterEmpresaAseguradora(evento) {
        var filtro = new FiltroPacienteClinica();

        if (evento.key == "Enter") {
            if (this.filtro.Documento == null) {
                this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
            } else if (this.filtro.Documento.length == 11) {

                filtro.Documento = this.filtro.Documento.trim();
                filtro.TipoDocumento = "R";
                this.personaService.listarpaginado(filtro).then((res) => {

                    console.log("enter empresa", res)
                    if (res.length > 0) {

                        this.filtro.NombreCompleto = res[0].NombreCompleto;
                        this.filtro.Persona = res[0].Persona;
                        this.editarCampoEmpresa = true;

                    } else {

                        this.filtro.Documento = null;
                        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
                    }
                });
            }
            else {
                this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
                this.filtro.Documento == null;
            }
        }
    }


}
