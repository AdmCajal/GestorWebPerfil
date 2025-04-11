
import { createReducer, on } from '@ngrx/store';
import { TreeNode } from 'primeng/api';
import { nodoRecursivoEdit, nodoRecursivoNuevo } from '../../../../../../util/funcionesGlogales';
import { cargarNodo, cargarNodoEdit, cargarNodoNew ,cargarNodoError, cargarNodoSuccess } from '../actions/tree-perfil.actions';


export interface NodeState {
    node: TreeNode[];
    loaded: boolean,
    loading: boolean,
    error: any
}

export const initialNodeState: NodeState = {
    node: [],
    loaded: false,
    loading: false,
    error: null
}

const _nodeReducer = createReducer(initialNodeState,

    on(cargarNodo, (state) => ({ ...state, loading: true })),

    on(cargarNodoSuccess, (state, { node }) => ({
        ...state,
        loading: false,
        loaded: true,
        node: [...node]
    })),

    on(cargarNodoError, (state, { payload }) => ({
        ...state,
        loading: false,
        loaded: true,
        error: {
            url:payload.url,
            name:payload.name,
            message:payload.message,
            status:payload.status
        }
    })),

    on(cargarNodoNew, (state) => ({
        ...state,
        node: nodoRecursivoNuevo(JSON.parse(JSON.stringify(state.node)))
    })),

    on(cargarNodoEdit, (state,{selected}) => ({
        ...state,
        node: nodoRecursivoEdit(JSON.parse(JSON.stringify(state.node)),selected)
    })),
);

export function nodeReducer(state, action) {
    return _nodeReducer(state, action);
}