import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AtributoTipo, Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`);
  }

  listarAdmin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos/admin/todos`);
  }

  obtener(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${environment.apiUrl}/productos/${id}`);
  }

  crear(datos: { nombre: string; descripcion?: string; precioBase: number; stock?: number }): Observable<Producto> {
    return this.http.post<Producto>(`${environment.apiUrl}/productos`, datos);
  }

  actualizar(id: string, datos: Partial<{ nombre: string; descripcion: string; precioBase: number; activo: boolean }>) {
    return this.http.patch<Producto>(`${environment.apiUrl}/productos/${id}`, datos);
  }

  actualizarStock(id: string, stock: number) {
    return this.http.patch<Producto>(`${environment.apiUrl}/productos/${id}/stock`, { stock });
  }

  eliminar(id: string) {
    return this.http.delete(`${environment.apiUrl}/productos/${id}`);
  }

  listarAtributoTipos(): Observable<AtributoTipo[]> {
    return this.http.get<AtributoTipo[]>(`${environment.apiUrl}/atributos`);
  }

  crearAtributoTipo(nombre: string) {
    return this.http.post<AtributoTipo>(`${environment.apiUrl}/atributos`, { nombre });
  }

  crearAtributoValor(tipoId: string, datos: { valor: string; codigoColorHex?: string }) {
    return this.http.post(`${environment.apiUrl}/atributos/${tipoId}/valores`, datos);
  }

  asignarAtributoAProducto(productoId: string, atributoValorId: string, modificadorPrecio: number) {
    return this.http.post(`${environment.apiUrl}/productos/${productoId}/atributos`, {
      atributoValorId,
      modificadorPrecio,
    });
  }

  subirImagen(productoId: string, archivo: File, atributoValorIds: string[]) {
    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('atributoValorIds', JSON.stringify(atributoValorIds));
    return this.http.post(`${environment.apiUrl}/productos/${productoId}/imagenes`, formData);
  }

  listarDisenos(productoId: string) {
    return this.http.get<{ id: string; nombre: string; url: string }[]>(
      `${environment.apiUrl}/productos/${productoId}/disenos`,
    );
  }

  subirDiseno(productoId: string, archivo: File, nombre: string) {
    const formData = new FormData();
    formData.append('diseno', archivo);
    formData.append('nombre', nombre);
    return this.http.post(`${environment.apiUrl}/productos/${productoId}/disenos`, formData);
  }
}
