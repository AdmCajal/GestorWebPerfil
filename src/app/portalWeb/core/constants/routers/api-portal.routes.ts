
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
    SEGURIDAD: {
        LOGIN: `${API_CUERPO.SEGURIDAD}/ListaLogin`,
        MENU: `${API_CUERPO.SEGURIDAD}/ListarMenu`,
    },

    USUARIO: {
        LISTAR: `${API_CUERPO.SEGURIDAD}/ListaUsuario`,
        LISTAR_PERFIL: `${API_CUERPO.SEGURIDAD}/ListarComboPerfil`,
    }
}