import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoPedido } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

const PEDIDO_INCLUDE = {
  detalles: {
    include: {
      producto: true,
      diseno: true,
      atributosElegidos: { include: { atributoValor: { include: { atributoTipo: true } } } },
    },
  },
  direccion: true,
  historial: { orderBy: { createdAt: 'asc' as const } },
};

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  ESPERANDO_PAGO: ['VERIFICANDO_PAGO'],
  VERIFICANDO_PAGO: ['EN_PROGRESO', 'ESPERANDO_PAGO'],
  EN_PROGRESO: ['ENVIADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
};

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(usuarioId: string, dto: CrearPedidoDto, comprobanteUrl: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { usuarioId } });
    if (!cliente) {
      throw new NotFoundException('Perfil de cliente no encontrado.');
    }

    const direccion = await this.prisma.direccion.findUnique({ where: { id: dto.direccionId } });
    if (!direccion || direccion.clienteId !== cliente.id) {
      throw new ForbiddenException('Esta dirección no pertenece al cliente.');
    }

    const detallesData = [];
    let total = 0;

    for (const item of dto.items) {
      const producto = await this.prisma.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || !producto.activo) {
        throw new NotFoundException(`Producto ${item.productoId} no encontrado.`);
      }
      if (producto.stock < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.nombre}.`);
      }
      if (item.tipoGrabado === 'SUBIDO_CLIENTE' && !item.grabadoUrl) {
        throw new BadRequestException('Debe adjuntar el archivo de grabado.');
      }
      if (item.tipoGrabado === 'DISENO_PREDETERMINADO' && !item.disenoId) {
        throw new BadRequestException('Debe seleccionar un diseño predeterminado.');
      }

      const atributoValores = item.atributoValorIds.length
        ? await this.prisma.productoAtributoValor.findMany({
            where: { productoId: item.productoId, atributoValorId: { in: item.atributoValorIds } },
          })
        : [];

      if (atributoValores.length !== item.atributoValorIds.length) {
        throw new BadRequestException('Alguna característica seleccionada no está disponible para este producto.');
      }

      const modificadorTotal = atributoValores.reduce((acc, av) => acc + Number(av.modificadorPrecio), 0);
      const precioUnitario = Number(producto.precioBase) + modificadorTotal;
      total += precioUnitario * item.cantidad;

      detallesData.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario,
        tipoGrabado: item.tipoGrabado,
        grabadoUrl: item.grabadoUrl,
        disenoId: item.disenoId,
        atributosElegidos: {
          create: atributoValores.map((av) => ({
            atributoValorId: av.atributoValorId,
            modificadorPrecio: av.modificadorPrecio,
          })),
        },
      });
    }

    return this.prisma.pedido.create({
      data: {
        clienteId: cliente.id,
        direccionId: dto.direccionId,
        total,
        comprobanteUrl,
        estado: 'ESPERANDO_PAGO',
        detalles: { create: detallesData },
        historial: { create: { estado: 'ESPERANDO_PAGO', nota: 'Comprobante de pago recibido.' } },
      },
      include: PEDIDO_INCLUDE,
    });
  }

  async listarPropios(usuarioId: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { usuarioId } });
    if (!cliente) {
      throw new NotFoundException('Perfil de cliente no encontrado.');
    }
    return this.prisma.pedido.findMany({
      where: { clienteId: cliente.id },
      orderBy: { createdAt: 'desc' },
      include: PEDIDO_INCLUDE,
    });
  }

  async obtenerPropio(usuarioId: string, pedidoId: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { usuarioId } });
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId }, include: PEDIDO_INCLUDE });
    if (!pedido || !cliente || pedido.clienteId !== cliente.id) {
      throw new NotFoundException('Pedido no encontrado.');
    }
    return pedido;
  }

  async listarAdmin(estado?: EstadoPedido) {
    return this.prisma.pedido.findMany({
      where: estado ? { estado } : undefined,
      orderBy: { createdAt: 'desc' },
      include: PEDIDO_INCLUDE,
    });
  }

  async obtenerAdmin(pedidoId: string) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId }, include: PEDIDO_INCLUDE });
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado.');
    }
    return pedido;
  }

  async actualizarEstado(
    adminId: string,
    pedidoId: string,
    nuevoEstado: EstadoPedido,
    trackingCorreos?: string,
    nota?: string,
  ) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId }, include: { detalles: true } });
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado.');
    }

    const permitidos = TRANSICIONES_VALIDAS[pedido.estado];
    if (!permitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se puede pasar de ${pedido.estado} a ${nuevoEstado}.`,
      );
    }

    if (nuevoEstado === 'ENVIADO' && !trackingCorreos) {
      throw new BadRequestException('Debe indicar el número de tracking de Correos de Costa Rica.');
    }

    return this.prisma.$transaction(async (tx) => {
      if (nuevoEstado === 'ENTREGADO') {
        for (const detalle of pedido.detalles) {
          await tx.producto.update({
            where: { id: detalle.productoId },
            data: { stock: { decrement: detalle.cantidad } },
          });
        }
      }

      await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          estado: nuevoEstado,
          trackingCorreos: trackingCorreos ?? pedido.trackingCorreos,
        },
      });

      await tx.historialEstado.create({
        data: { pedidoId, estado: nuevoEstado, adminId, nota },
      });

      return tx.pedido.findUnique({ where: { id: pedidoId }, include: PEDIDO_INCLUDE });
    });
  }
}
