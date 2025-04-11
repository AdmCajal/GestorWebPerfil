import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { PerfilUserService } from "../../service/produce.service";
import * as perfilDetalleActions from '../actions'

@Injectable()
export class PerfilUsuarioDetalleEffects {

    constructor(
        private actions$: Actions,
        private perfilUsuarioDetalleService: PerfilUserService,
    ) {
    }

    cargarPerfilDetalle = createEffect(
        () => this.actions$.pipe(
            ofType(perfilDetalleActions.cargarNodo),
            mergeMap(
                () => this.perfilUsuarioDetalleService.getFiles()
                    .pipe(
                        map(node => perfilDetalleActions.cargarNodoSuccess({ node })),
                        catchError(err => of(perfilDetalleActions.cargarNodoError({ payload: err })))
                    )
            )
        )
    )


}
