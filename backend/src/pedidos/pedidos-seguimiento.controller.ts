import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { voucherUploadOptions } from '../common/config/multer.config';
import { PedidosService } from './pedidos.service';

@UseGuards(JwtAuthGuard)
@Controller('pedidos/seguimiento')
export class PedidosSeguimientoController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get(':token')
  obtener(@CurrentUser() user: AuthUser, @Param('token') token: string) {
    return this.pedidosService.obtenerPorToken(user.id, token);
  }

  @Post(':token/comprobante')
  @UseInterceptors(FileInterceptor('comprobante', voucherUploadOptions))
  actualizarComprobante(
    @CurrentUser() user: AuthUser,
    @Param('token') token: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar el comprobante de pago.');
    }
    const comprobanteUrl = `/uploads/vouchers/${file.filename}`;
    return this.pedidosService.actualizarComprobantePorToken(user.id, token, comprobanteUrl);
  }
}
