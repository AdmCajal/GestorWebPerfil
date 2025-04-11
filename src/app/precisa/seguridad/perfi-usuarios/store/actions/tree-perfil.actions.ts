import { createAction, props } from '@ngrx/store';
import { TreeNode } from 'primeng/api';

export const cargarNodo = createAction(
    '[TreeNode Perfil] cargarNodo'
);

export const cargarNodoSuccess = createAction(
    '[TreeNode Perfil] cargarNodoSuccess',
    props<{ node: TreeNode[] }>()
);

export const cargarNodoError = createAction(
    '[TreeNode Perfil] cargarNodoError',
    props<{ payload:any }>()
);

export const cargarNodoNew = createAction(
    '[TreeNode Perfil] cargarNodoNew'
);

export const cargarNodoEdit = createAction(
    '[TreeNode Perfil] cargarNodoEdit',
    props<{selected:string[]}>()
);

