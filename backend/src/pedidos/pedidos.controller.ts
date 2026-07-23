import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EstadoPedido } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { voucherUploadOptions, engravingUploadOptions } from '../common/config/multer.config';
import { PedidosService } from './pedidos.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';

@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('subir-grabado')
  @UseInterceptors(FileInterceptor('archivo', engravingUploadOptions))
  subirGrabado(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo.');
    }
    return { url: `/uploads/grabados/${file.filename}` };
  }

  @Post()
  @UseInterceptors(FileInterceptor('comprobante', voucherUploadOptions))
  async crear(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('direccionId') direccionId: string,
    @Body('items') itemsRaw: string,
  ) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar el comprobante de pago (SINPE o transferencia).');
    }

    let items: unknown;
    try {
      items = JSON.parse(itemsRaw);
    } catch {
      throw new BadRequestException('El formato de "items" es inválido.');
    }

    const dto = plainToInstance(CrearPedidoDto, { direccionId, items });
    const errores = await validate(dto);
    if (errores.length > 0) {
      throw new BadRequestException(errores.map((e) => Object.values(e.constraints ?? {})).flat());
    }

    const comprobanteUrl = `/uploads/vouchers/${file.filename}`;
    return this.pedidosService.crear(user.id, dto, comprobanteUrl);
  }

  @Get('mios')
  listarPropios(@CurrentUser() user: AuthUser) {
    return this.pedidosService.listarPropios(user.id);
  }

  @Get('mios/:id')
  obtenerPropio(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.pedidosService.obtenerPropio(user.id, id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get()
  listarAdmin(@Query('estado') estado?: EstadoPedido) {
    return this.pedidosService.listarAdmin(estado);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  obtenerAdmin(@Param('id') id: string) {
    return this.pedidosService.obtenerAdmin(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/estado')
  actualizarEstado(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ActualizarEstadoDto,
  ) {
    return this.pedidosService.actualizarEstado(user.id, id, dto.estado, dto.trackingCorreos, dto.nota);
  }
}
