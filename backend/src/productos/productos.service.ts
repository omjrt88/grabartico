import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductoDto, UpdateProductoDto, UpdateStockDto } from './dto/producto.dto';

const DETALLE_INCLUDE = {
  atributoValores: { include: { atributoValor: { include: { atributoTipo: true } } } },
  imagenes: { orderBy: { orden: 'asc' as const }, include: { atributosMapeo: true } },
  disenos: { where: { activo: true } },
};

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async listarPublico() {
    return this.prisma.producto.findMany({
      where: { activo: true },
      orderBy: { createdAt: 'desc' },
      include: DETALLE_INCLUDE,
    });
  }

  async listarAdmin() {
    return this.prisma.producto.findMany({ orderBy: { createdAt: 'desc' }, include: DETALLE_INCLUDE });
  }

  async obtener(id: string) {
    const producto = await this.prisma.producto.findUnique({ where: { id }, include: DETALLE_INCLUDE });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }
    return producto;
  }

  async crear(dto: CreateProductoDto) {
    return this.prisma.producto.create({ data: dto });
  }

  async actualizar(id: string, dto: UpdateProductoDto) {
    await this.obtener(id);
    return this.prisma.producto.update({ where: { id }, data: dto });
  }

  async actualizarStock(id: string, dto: UpdateStockDto) {
    await this.obtener(id);
    return this.prisma.producto.update({ where: { id }, data: { stock: dto.stock } });
  }

  async eliminar(id: string) {
    await this.obtener(id);
    await this.prisma.producto.update({ where: { id }, data: { activo: false } });
    return { ok: true };
  }
}
