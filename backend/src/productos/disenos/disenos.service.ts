import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DisenosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(productoId: string) {
    return this.prisma.disenoPredeterminado.findMany({
      where: { productoId, activo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async agregar(productoId: string, nombre: string, url: string) {
    const producto = await this.prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }
    return this.prisma.disenoPredeterminado.create({ data: { productoId, nombre, url } });
  }

  async eliminar(id: string) {
    const diseno = await this.prisma.disenoPredeterminado.findUnique({ where: { id } });
    if (!diseno) {
      throw new NotFoundException('Diseño no encontrado.');
    }
    await this.prisma.disenoPredeterminado.update({ where: { id }, data: { activo: false } });
    return { ok: true };
  }
}
