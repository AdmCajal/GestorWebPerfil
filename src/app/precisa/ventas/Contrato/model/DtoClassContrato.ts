import { DtoClassContratoDellate } from './DtoClassContratoDellate';
import { DtoContrato } from './DtoContrato';
import { DtoClassContratoComision } from './DtoClassContratoComision';

export class DtoClassContrato {
    constructor() {
        this.Detalle=[];
        this.Contrato;
        this.Comision=[];
    }


    success:   boolean;
    tokem:     string;
    Contrato: DtoContrato;
    Detalle:DtoClassContratoDellate[];
    Comision:DtoClassContratoComision[];
}