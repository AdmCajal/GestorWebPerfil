export class DtoClassContratoDellate {
    constructor() {
    }
    Id:                 number;
    Codigo:             string;
    Concepto:           string;
    Monto:              number;
    Cantidad:           number;
    campodisabled:      boolean = false;
    color:              string;
    FechaVencimiento ?: Date;

}
export class DtoClassCmisionistaDetalle {
    constructor() {
    }
    Id: number;
    Descripcion: string;
    Monto: number;
}