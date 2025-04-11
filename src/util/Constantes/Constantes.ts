export class ConstanteUI {

    /** para cuando se quiere ver los listados desde los menus**/
    public static ACCION_SOLICITADA_LISTAR = "LISTAR";

    /** desde la venta de listado se da click en boton nuevo **/
    public static ACCION_SOLICITADA_NUEVO = "NUEVO";

    /** desde la venta de listado se da click en boton nuevo **/
    public static ACCION_SOLICITADA_INGRESAR = "INGRESAR";

    /** desde la ventana de listado se desea modificar la informacion de un registro **/
    public static ACCION_SOLICITADA_EDITAR = "EDITAR";

    /** desde la ventana de listado se desea anular un registro en forma logica**/
    public static ACCION_SOLICITADA_ANULAR = "ANULAR";

    /** desde la ventana de listado se desea eliminar fisicamente un registro **/
    public static ACCION_SOLICITADA_ELIMINAR = "ELIMINAR";

    public static ACCION_SOLICITADA_VER = "VER";

    public static ACCION_SOLICITADA_COPIAR = 'COPIAR';

    public static ACCION_SOLICITADA_REVERTIR = 'REVERTIR';


    // EXPRESIONES REGULARES PARA CAMPOS
    public static EXPRESIONES_REGULARES_ALFANUMERICO = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ,.\d\-_\s]+$/;

    public static expresion_mayusminus = /^[a-zA-Z\d\-_\s]+$/;

    public static EXPRESIONES_REGULARES_LETRAS = /^[a-zA-Z ]/;

    public static EXPRESIONES_REGULARES_NUMERICO = /^[0-9]/;

    public static EXPRESIONES_REGULARES_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //MENU SEGURIDAD
    public static MENUSEGURIDAD = 'menu-seguridad';

    //TOKEN DE USUARIO
    public static TOKEN_USUARIO = JSON.parse(sessionStorage.getItem('access_user_token'));

    //CODIGO USADOS EN SERVICIOS
    public static SERVICIO_SOLICITUD_NUEVO = 1;
    public static SERVICIO_SOLICITUD_EDITAR = 2;
    public static SERVICIO_SOLICITUD_ANULAR = 3;
    public static SERVICIO_SOLICITUD_INACTIVAR = 3;
    public static SERVICIO_SOLICITUD_ELIMINAR = 3;
    public static SERVICIO_SOLICITUD_APROBAR = 3;

    //CODIGO USADOS PASA VERDADERO O FALSO
    public static ESTADO_NUMERICO_TRUE = 1;
    public static ESTADO_NUMERICO_FALSE = 0;
    public static ESTADO_NUMERICO_ACTIVO = 1;
    public static ESTADO_NUMERICO_INACTIVO = 2;
    public static ESTADO_NUMERICO_ANULAR = 3;
    public static ESTADO_NUMERICO_APROBADO = 8;

    public static API_KEY_GOOGLE = "AIzaSyA-0joSm6mgnhz6jumfxE0w8COsLsJPBYA";
    /** Tipo de busqueda de coordenada obtener distrito */
    public static TIPO_BUSCAR_COORDENADA_DISTRITO = "neighborhood";
    /** Tipo de busqueda de coordenada obtener distrito */
    public static TIPO_BUSCAR_COORDENADA_ZONA = "street_address";
  
}

