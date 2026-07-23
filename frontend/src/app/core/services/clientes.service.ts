import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cliente, Direccion } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  constructor(private readonly http: HttpClient) {}

  perfil() {
    return this.http.get<Cliente>(`${environment.apiUrl}/clientes/perfil`);
  }

  actualizarPerfil(datos: Partial<{ nombre: string; apellidos: string; telefono: string }>) {
    return this.http.patch<Cliente>(`${environment.apiUrl}/clientes/perfil`, datos);
  }

  direcciones() {
    return this.http.get<Direccion[]>(`${environment.apiUrl}/clientes/direcciones`);
  }

  crearDireccion(datos: Omit<Direccion, 'id' | 'clienteId'>) {
    return this.http.post<Direccion>(`${environment.apiUrl}/clientes/direcciones`, datos);
  }

  actualizarDireccion(id: string, datos: Partial<Omit<Direccion, 'id' | 'clienteId'>>) {
    return this.http.patch<Direccion>(`${environment.apiUrl}/clientes/direcciones/${id}`, datos);
  }

  eliminarDireccion(id: string) {
    return this.http.delete(`${environment.apiUrl}/clientes/direcciones/${id}`);
  }
}
