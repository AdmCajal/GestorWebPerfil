export interface Menu {
    titulo: string;
    ordenModulo: number;
    nombre: string;
    url: string;
    nivelModulo: number;
    status?: number;
    estado?: string;
    id_menu: number;
    icono: string;
    submenu: Submenu[]; // Agrega esta propiedad
  }
  
  export interface Submenu {
    id_menu: number;
    estado: string;
    nombre: string;
    nivelModulo: number;
    icono: string;
    url: string;
  }
  