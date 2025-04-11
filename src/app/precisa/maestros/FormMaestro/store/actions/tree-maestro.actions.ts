import { createAction, props } from '@ngrx/store';
import { TreeNode } from 'primeng/api';

export const cargarNodo = createAction(
    '[TreeNode Maestro] cargarNodo'
);

export const cargarNodoSuccess = createAction(
    '[TreeNode Maestro] cargarNodoSuccess',
    props<{ node: TreeNode[] }>()
);

export const cargarNodoError = createAction(
    '[TreeNode Maestro] cargarNodoError',
    props<{ payload:any }>()
);

export const cargarNodoNew = createAction(
    '[TreeNode Maestro] cargarNodoNew'
);

export const cargarNodoEdit = createAction(
    '[TreeNode Maestro] cargarNodoEdit',
    props<{selected:string[]}>()
);

