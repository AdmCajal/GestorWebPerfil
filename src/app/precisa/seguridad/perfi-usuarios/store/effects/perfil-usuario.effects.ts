

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { PerfilUserService } from '../../service/produce.service';
import * as perfilActions from '../actions'

@Injectable()
export class PerfilEffects {
    constructor(private actions$: Actions,private perfilService:PerfilUserService) {}

    cargarPerfiles = createEffect(
        () => this.actions$.pipe(
            ofType(perfilActions.cargarLista),
            mergeMap(
                () => this.perfilService.listarPerfiles()
                    .pipe(
                        map(perfil => perfilActions.listar({perfil})),
                        catchError(err => of(perfilActions.cargarError({ payload: err })))
                    )
            )
        )
    )


}

