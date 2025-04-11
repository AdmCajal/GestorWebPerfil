
import { createReducer, on } from '@ngrx/store';
import { PerfilUsuiario } from '../../model/perfil-usuario';
import { cargarError, cargarLista, copiar, crear, editar, eliminar, inactivar, listar } from '../actions/perfil-usuario.actions'


export interface PerfilState {
    perfiles: PerfilUsuiario[];
    loaded: boolean,
    loading: boolean,
    error: any
}

export const initialState: PerfilState = {
    perfiles: [],
    loaded: false,
    loading: false,
    error: null
}
//export const initialState: PerfilUsuiario[] = []

const _crearPerfilUsuarioReducer = createReducer(initialState,

    on(cargarLista, (state) => ({ ...state, loading: true })),

    on(listar, (state, { perfil }) => ({
        ...state,
        loading: false,
        loaded: true,
        perfiles: [...perfil]
    })),

    on(crear, (state, { perfil }) => ({
        ...state,
        loading: false,
        loaded: true,
        perfiles: [...state.perfiles, perfil]
    })),

    on(editar, (state, { id,perfil }) => ({
        ...state,
        loading: false,
        loaded: true,
        perfiles: state.perfiles.reduce((acc, el) => {
            if (el.tipousuario === id) {
                acc.push(perfil)
                return acc
            } else {
                acc.push(el)
                return acc
            }

        }, [])
    })),

    on(inactivar, (state, { id,estado }) => ({
        ...state,
        loading: false,
        loaded: true,
        perfiles: state.perfiles.map(perfil => {
            if (perfil.tipousuario === id) {
                return {
                    ...perfil,
                    VaEstado: estado
                }
            } else {
                return perfil
            }
        })
    })),

    on(copiar, (state, { perfil }) => ({
        ...state,
        loading: false,
        loaded: true,
        perfiles: [...state.perfiles, perfil]
    })),

    on(eliminar, (state, { id }) => ({
        ...state,
        loading: false,
        loaded: true,
        perfiles: state.perfiles.filter(x => x.tipousuario !== id)
    })),

    on(cargarError, (state, { payload }) => ({
        ...state,
        error: {
            url:payload.url,
            name:payload.name,
            message:payload.message,
            status:payload.status
        }
    })),
   // on(listar, (state ,perfil) => state.push.apply(null,perfil)),

    //on(crear, (state, { perfil }) => [...state, perfil]),

    /* on(editar, (state, { id, perfil }) => {
        return state.perfiles.reduce((acc, el) => {
            if (+el.id === id) {
                acc.push(perfil)
                return acc
            } else {
                acc.push(el)
                return acc
            }

        }, [])
    }), */

   /*  on(inactivar, (state, { id, estado }) => {
        return state.map(perfil => {
            if (+perfil.id === id) {
                return {
                    ...perfil,
                    inventoryStatus: estado
                }
            } else {
                return perfil
            }
        })
    }), */

    //on(copiar, (state, { perfil }) => [...state, perfil]),

    //on(eliminar,(state,{id}) => state.filter(x => +x.id !== id)),


);

export function PerfilUsuarioReducer(state, action) {
    return _crearPerfilUsuarioReducer(state, action);
}