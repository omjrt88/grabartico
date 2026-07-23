import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAtributoTipoDto, CreateAtributoValorDto, AsignarAtributoProductoDto } from './dto/atributo.dto';

@Injectable()
export class AtributosService {
  constructor(private readonly prisma: PrismaService) {}

  listarTipos() {
    return this.prisma.atributoTipo.findMany({
      orderBy: { orden: 'asc' },
      include: { valores: { orderBy: { orden: 'asc' } } },
    });
  }

  crearTipo(dto: CreateAtributoTipoDto) {
    return this.prisma.atributoTipo.create({ data: dto });
  }

  async crearValor(atributoTipoId: string, dto: CreateAtributoValorDto) {
    await this.assertTipoExiste(atributoTipoId);
    return this.prisma.atributoValor.create({ data: { ...dto, atributoTipoId } });
  }

  async eliminarValor(id: string) {
    await this.assertValorExiste(id);
    return this.prisma.atributoValor.delete({ where: { id } });
  }

  async asignarAProducto(productoId: string, dto: AsignarAtributoProductoDto) {
    await this.assertValorExiste(dto.atributoValorId);
    return this.prisma.productoAtributoValor.upsert({
      where: {
        productoId_atributoValorId: { productoId, atributoValorId: dto.atributoValorId },
      },
      create: {
        productoId,
        atributoValorId: dto.atributoValorId,
        modificadorPrecio: dto.modificadorPrecio ?? 0,
      },
      update: {
        modificadorPrecio: dto.modificadorPrecio ?? 0,
      },
    });
  }

  async desasignarDeProducto(productoId: string, atributoValorId: string) {
    await this.prisma.productoAtributoValor.delete({
      where: { productoId_atributoValorId: { productoId, atributoValorId } },
    });
    return { ok: true };
  }

  private async assertTipoExiste(id: string) {
    const tipo = await this.prisma.atributoTipo.findUnique({ where: { id } });
    if (!tipo) {
      throw new NotFoundException('Tipo de atributo no encontrado.');
    }
  }

  private async assertValorExiste(id: string) {
    const valor = await this.prisma.atributoValor.findUnique({ where: { id } });
    if (!valor) {
      throw new NotFoundException('Valor de atributo no encontrado.');
    }
  }
}
