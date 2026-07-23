export interface Direccion {
  id: string;
  clienteId: string;
  provincia: string;
  canton: string;
  distrito: string;
  senasExactas: string;
  codigoPostal: string | null;
  esDefault: boolean;
}

export interface Cliente {
  id: string;
  usuarioId: string;
  nombre: string;
  apellidos: string;
  telefono: string | null;
  direcciones: Direccion[];
  usuario: { email: string };
}
