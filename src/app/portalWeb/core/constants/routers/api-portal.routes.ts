
const VERSION = '';

const API_CUERPO = {
    //Apis Compartidas
    CONTROLADOR: `${VERSION}/nombre`,

    SEGURIDAD: `${VERSION}/seguridad`,
    MAESTRO: `${VERSION}/maestro`,
}

export const API_PORTAL_ROUTES = {

    CONTROLADOR: {
        LISTAR: `${API_CUERPO.CONTROLADOR}/`,
        INSERTAR: `${API_CUERPO.CONTROLADOR}/`,
        ACTUALIZAR: `${API_CUERPO.CONTROLADOR}/`,
        ELIMINAR: `${API_CUERPO.CONTROLADOR}/`,
    },

    MAESTRO: {
        LISTAR: `${API_CUERPO.MAESTRO}/ListaTablaMaestroDetalle`,
    },
    PERSONA: {
        LISTAR: `${API_CUERPO.MAESTRO}/ListaPersona`,
        LISTAR_REPRESENTANTE: `${API_CUERPO.MAESTRO}/ListaPersonaUsuario`,
        LISTAR_UBIGEO: `${API_CUERPO.MAESTRO}/ListaUbigeo`,
        MANTENIMIENTO: `${API_CUERPO.MAESTRO}/ListaPersona`,
    },
    SUCURSAL: {
        LISTAR: `${API_CUERPO.MAESTRO}/ListaSede`,
        MANTENIMIENTO: `${API_CUERPO.MAESTRO}/MantenimientoSede/`,
    },

    SEGURIDAD: {
        LOGIN: `${API_CUERPO.SEGURIDAD}/ListaLogin`,
        MENU: `${API_CUERPO.SEGURIDAD}/ListarMenu`,
    },

    USUARIO: {
        LISTAR: `${API_CUERPO.SEGURIDAD}/ListaUsuario`,
        LISTAR_PERFIL: `${API_CUERPO.SEGURIDAD}/ListarComboPerfil`,
        MANTENIMIENTO: `${API_CUERPO.SEGURIDAD}/MantenimientoUsuario/`,
    },
    COMPANIA: {
        LISTAR: `${API_CUERPO.SEGURIDAD}/ListarCompania`,
        MANTENIMIENTO: `${API_CUERPO.SEGURIDAD}/MantenimientoCompania/`,
    },
    APLICATIVO: {
        LISTAR: `${API_CUERPO.SEGURIDAD}/ListarSistema`,
        MANTENIMIENTO: `${API_CUERPO.SEGURIDAD}/MantenimientoSistema/`,
        LISTAR_JERAQUIAS: `${API_CUERPO.SEGURIDAD}/ListarOpcionJerarquia`,
    },

}