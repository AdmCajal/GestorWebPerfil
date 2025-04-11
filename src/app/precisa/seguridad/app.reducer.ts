import { ActionReducerMap } from "@ngrx/store";
import { PerfilUsuarioReducer } from "./perfi-usuarios/store/reducers/perfil-usuario.reducer";
import * as nodeReducers from './perfi-usuarios/store/reducers'

export interface AppSatate{
    perfil:nodeReducers.PerfilState
    perfilDetalle:nodeReducers.NodeState
}

export const appReducers: ActionReducerMap<AppSatate>={
    perfil:PerfilUsuarioReducer,
    perfilDetalle:nodeReducers.nodeReducer
}