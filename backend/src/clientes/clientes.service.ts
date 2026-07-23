import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { CreateDireccionDto, UpdateDireccionDto } from './dto/direccion.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getClienteOrThrow(usuarioId: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { usuarioId } });
    if (!cliente) {
      throw new NotFoundException('Perfil de cliente no encontrado.');
    }
    return cliente;
  }

  async getPerfil(usuarioId: string) {
    return this.prisma.cliente.findUnique({
      where: { usuarioId },
      include: { direcciones: true, usuario: { select: { email: true } } },
    });
  }

  async actualizarPerfil(usuarioId: string, dto: UpdateClienteDto) {
    const cliente = await this.getClienteOrThrow(usuarioId);
    return this.prisma.cliente.update({ where: { id: cliente.id }, data: dto });
  }

  async listarDirecciones(usuarioId: string) {
    const cliente = await this.getClienteOrThrow(usuarioId);
    return this.prisma.direccion.findMany({ where: { clienteId: cliente.id }, orderBy: { createdAt: 'desc' } });
  }

  async crearDireccion(usuarioId: string, dto: CreateDireccionDto) {
    const cliente = await this.getClienteOrThrow(usuarioId);

    if (dto.esDefault) {
      await this.prisma.direccion.updateMany({ where: { clienteId: cliente.id }, data: { esDefault: false } });
    }

    return this.prisma.direccion.create({ data: { ...dto, clienteId: cliente.id } });
  }

  async actualizarDireccion(usuarioId: string, direccionId: string, dto: UpdateDireccionDto) {
    const cliente = await this.getClienteOrThrow(usuarioId);
    await this.assertDireccionPertenece(cliente.id, direccionId);

    if (dto.esDefault) {
      await this.prisma.direccion.updateMany({ where: { clienteId: cliente.id }, data: { esDefault: false } });
    }

    return this.prisma.direccion.update({ where: { id: direccionId }, data: dto });
  }

  async eliminarDireccion(usuarioId: string, direccionId: string) {
    const cliente = await this.getClienteOrThrow(usuarioId);
    await this.assertDireccionPertenece(cliente.id, direccionId);
    await this.prisma.direccion.delete({ where: { id: direccionId } });
    return { ok: true };
  }

  private async assertDireccionPertenece(clienteId: string, direccionId: string) {
    const direccion = await this.prisma.direccion.findUnique({ where: { id: direccionId } });
    if (!direccion || direccion.clienteId !== clienteId) {
      throw new ForbiddenException('Esta dirección no pertenece al cliente.');
    }
  }
}
