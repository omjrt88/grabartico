import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EstadoPedido, ItemCarrito, Pedido } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  constructor(private readonly http: HttpClient) {}

  subirGrabado(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/pedidos/subir-grabado`, formData);
  }

  crear(direccionId: string, items: ItemCarrito[], comprobante: File) {
    const formData = new FormData();
    formData.append('direccionId', direccionId);
    formData.append(
      'items',
      JSON.stringify(
        items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          atributoValorIds: item.atributoValorIds,
          tipoGrabado: item.tipoGrabado,
          grabadoUrl: item.grabadoUrl,
          disenoId: item.disenoId,
        })),
      ),
    );
    formData.append('comprobante', comprobante);
    return this.http.post<Pedido>(`${environment.apiUrl}/pedidos`, formData);
  }

  misPedidos() {
    return this.http.get<Pedido[]>(`${environment.apiUrl}/pedidos/mios`);
  }

  miPedido(id: string) {
    return this.http.get<Pedido>(`${environment.apiUrl}/pedidos/mios/${id}`);
  }

  listarAdmin(estado?: EstadoPedido) {
    const url = estado ? `${environment.apiUrl}/pedidos?estado=${estado}` : `${environment.apiUrl}/pedidos`;
    return this.http.get<Pedido[]>(url);
  }

  obtenerAdmin(id: string) {
    return this.http.get<Pedido>(`${environment.apiUrl}/pedidos/${id}`);
  }

  actualizarEstado(id: string, estado: EstadoPedido, trackingCorreos?: string, nota?: string) {
    return this.http.patch<Pedido>(`${environment.apiUrl}/pedidos/${id}/estado`, {
      estado,
      trackingCorreos,
      nota,
    });
  }
}
