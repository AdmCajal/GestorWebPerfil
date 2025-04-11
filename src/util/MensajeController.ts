
export class MensajeController {

    constructor(obj: any, componente: string, tipo: string){
        this.componenteDestino = obj;
        this.componente = componente;
        this.tipo = tipo;
    }

    //componente empleado, centro de costo
    componente: string;

    // tipo de mensaje enviado de un componente a otro
    tipo: string;

    // resultado que da el proceso (unico,arreglo,etc)
    resultado:any;

    // paramatros que son pasados de un componente a otro
    parametros:any;

    // componente que recepciona el mensaje 
    componenteDestino: any;    
}
