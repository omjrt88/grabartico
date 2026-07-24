export type EstadoPedido = 'ESPERANDO_PAGO' | 'VERIFICANDO_PAGO' | 'EN_PROGRESO' | 'ENVIADO' | 'ENTREGADO';
export type TipoGrabado = 'SUBIDO_CLIENTE' | 'DISENO_PREDETERMINADO';

export const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  ESPERANDO_PAGO: 'Esperando Pago',
  VERIFICANDO_PAGO: 'Verificando Pago',
  EN_PROGRESO: 'En Progreso',
  ENVIADO: 'Enviado por Correos de Costa Rica',
  ENTREGADO: 'Entregado y Completado',
};

export interface DetallePedidoAtributo {
  id: string;
  atributoValorId: string;
  modificadorPrecio: string;
  atributoValor: {
    id: string;
    valor: string;
    atributoTipo: { nombre: string };
  };
}

export interface DetallePedido {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: string;
  tipoGrabado: TipoGrabado;
  grabadoUrl: string | null;
  disenoId: string | null;
  producto: { nombre: string };
  atributosElegidos: DetallePedidoAtributo[];
}

export interface HistorialEstado {
  id: string;
  estado: EstadoPedido;
  adminId: string | null;
  nota: string | null;
  createdAt: string;
}

export interface Pedido {
  id: string;
  clienteId: string;
  direccionId: string;
  estado: EstadoPedido;
  total: string;
  comprobanteUrl: string | null;
  tokenAcceso: string;
  puedeActualizarComprobante?: boolean;
  trackingCorreos: string | null;
  notaAdmin: string | null;
  createdAt: string;
  detalles: DetallePedido[];
  historial: HistorialEstado[];
}

export interface ItemCarrito {
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  atributoValorIds: string[];
  atributosDescripcion: string;
  precioUnitario: number;
  tipoGrabado: TipoGrabado;
  grabadoUrl?: string;
  disenoId?: string;
  disenoNombre?: string;
}
