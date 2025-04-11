import { createAction, props } from '@ngrx/store';
import { PerfilUsuiario } from '../../model/perfil-usuario';

export const cargarLista = createAction(
    '[Perfil Usuario] cargar');

export const listar = createAction(
    '[Perfil Usuario] listar',
    props<{ perfil:PerfilUsuiario [] }>());

export const crear = createAction(
    '[Perfil Usuario] crear',
    props<{ perfil: PerfilUsuiario }>());

export const editar = createAction(
    '[Perfil Usuario] editar',
    props<{ id: any, perfil: PerfilUsuiario }>());

export const inactivar = createAction(
    '[Perfil Usuario] inactivar',
    props<{ id: any, estado: string }>());

export const copiar = createAction(
    '[Perfil Usuario] copiar',
    props<{ perfil: PerfilUsuiario }>());

export const eliminar = createAction(
    '[Perfil Usuario] eliminar',
    props<{ id: any }>());

export const cargarError = createAction(
    '[Perfil Usuario] errors',
    props<{ payload: any }>());