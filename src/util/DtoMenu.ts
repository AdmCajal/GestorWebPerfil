export class DtoMenu {
    label: string;

	constructor(){
		this.titulo="LISTADO"
	}
    flgAgregar: boolean;
	flgModificar: boolean;
	flgBorrar: boolean;
	flgAprobar: boolean;
	flgExportar: boolean;

	flgVerDocs: boolean;
	flgEnviarCorreo: boolean;
	flgOtros: boolean;
	parametroValor:number

	urlAyuda: string;

	titulo: string;
	icono: string;

}