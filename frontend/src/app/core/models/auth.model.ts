export type RolUsuario = 'ADMIN' | 'CLIENTE';

export interface Usuario {
  id: string;
  email: string;
  rol: RolUsuario;
}

export interface SesionAuth {
  accessToken: string;
  usuario: Usuario;
}
