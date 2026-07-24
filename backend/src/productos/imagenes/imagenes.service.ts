import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImagenesService {
  constructor(private readonly prisma: PrismaService) {}

  async agregar(productoId: string, url: string, atributoValorIds: string[], orden = 0) {
    const producto = await this.prisma.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado.');
    }

    return this.prisma.imagenProducto.create({
      data: {
        productoId,
        url,
        orden,
        atributosMapeo: {
          create: atributoValorIds.map((atributoValorId) => ({ atributoValorId })),
        },
      },
      include: { atributosMapeo: true },
    });
  }

  async actualizarMapeo(id: string, atributoValorIds: string[], orden?: number) {
    const imagen = await this.prisma.imagenProducto.findUnique({ where: { id } });
    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.imagenProductoAtributo.deleteMany({ where: { imagenId: id } });
      return tx.imagenProducto.update({
        where: { id },
        data: {
          orden: orden ?? imagen.orden,
          atributosMapeo: { create: atributoValorIds.map((atributoValorId) => ({ atributoValorId })) },
        },
        include: { atributosMapeo: true },
      });
    });
  }

  async eliminar(id: string) {
    const imagen = await this.prisma.imagenProducto.findUnique({ where: { id } });
    if (!imagen) {
      throw new NotFoundException('Imagen no encontrada.');
    }
    await this.prisma.imagenProducto.delete({ where: { id } });
    return { ok: true };
  }
}
