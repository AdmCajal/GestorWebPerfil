export class ConstanteAngular {

    /** para cuando se quiere ver los listados desde los menus**/
    public static ACCION_SOLICITADA_LISTAR = "LISTAR";

    /** desde la venta de listado se da click en boton nuevo **/
    public static ACCION_SOLICITADA_NUEVO = "NUEVO";

    /** desde la ventana de listado se desea modificar la informacion de un registro **/
    public static ACCION_SOLICITADA_EDITAR = "EDITAR";

    /** desde la ventana de listado se desea anular un registro en forma logica**/
    public static ACCION_SOLICITADA_ANULAR = "ANULAR";

    /** desde la ventana de listado se desea eliminar fisicamente un registro **/
    public static ACCION_SOLICITADA_ELIMINAR = "ELIMINAR";

    public static ACCION_SOLICITADA_VER = "VER";

    public static ACCION_SOLICITADA_COPIAR = 'COPIAR';

    public static ACCION_SOLICITADA_REVERTIR = 'REVERTIR';

    public static ACCION_SOLICITADA_GUARDAR = 'GUARDAR';
    public static ACCION_SOLICITADA_SALIR = 'SALIR';
    public static ACCION_SOLICITADA_BUSCAR = "BUSCAR";


    // EXPRESIONES REGULARES PARA CAMPOS
    public static EXPRESIONES_REGULARES_ALFANUMERICO = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ,.\d\-_\s]+$/;

    public static expresion_mayusminus = /^[a-zA-Z\d\-_\s]+$/;

    public static EXPRESIONES_REGULARES_LETRAS = /^[a-zA-Z ]/;

    public static EXPRESIONES_REGULARES_NUMERICO = /^[0-9]/;

    //MENU SEGURIDAD
    public static MENUSEGURIDAD = 'menu-seguridad';

    //FILTROS
    public static FILTROSESION = 'filtrosession';


    //Combos
    public static COMBOTODOS = '-- TODOS --';
    public static COMBOSELECCIONE = '-- SELECCIONE --';
    public static COMBOSEXO = '-- SEXO --';
    //ESTANDAR BOTONES CABECERA
    public static BOTONEXPORTAR = 'BOTONEXPORTAR';
    public static BOTONEXPORTARCORTO = 'BOTONEXPORTARCORTO';    

    static readonly SOLICITUD_ACCION_APROBAR: string = 'APROBAR';
    static readonly SOLICITUD_ACCION_RECHAZAR: string = 'RECHAZAR';
    static readonly SOLICITUD_ACCION_DEVOLVER: string = 'DEVOLVER';
    static readonly SOLICITUD_ACCION_DESISTIR: string = 'DESISTIR';

    static readonly ESTADO_ACTIVO: "A";


}

