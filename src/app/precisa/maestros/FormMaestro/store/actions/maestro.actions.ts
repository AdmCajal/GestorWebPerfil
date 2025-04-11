import { createAction, props } from '@ngrx/store';
import { Maestro } from '../../model/maestro';

export const cargarLista = createAction(
    '[Perfil Usuario] cargar');

export const listar = createAction(
    '[Perfil Usuario] listar',
    props<{ maestro:Maestro [] }>());

export const crear = createAction(
    '[Perfil Usuario] crear',
    props<{ maestro: Maestro }>());

export const editar = createAction(
    '[Perfil Usuario] editar',
    props<{ id: number, maestro: Maestro }>());

export const inactivar = createAction(
    '[Perfil Usuario] inactivar',
    props<{ id: number, estado: string }>());

export const copiar = createAction(
    '[Perfil Usuario] copiar',
    props<{ maestro: Maestro }>());

export const eliminar = createAction(
    '[Perfil Usuario] eliminar',
    props<{ id: number }>());

export const cargarError = createAction(
    '[Perfil Usuario] errors',
    props<{ payload: any }>());