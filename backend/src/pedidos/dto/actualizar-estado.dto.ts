import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoPedido } from '@prisma/client';

export class ActualizarEstadoDto {
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;

  @IsOptional()
  @IsString()
  trackingCorreos?: string;

  @IsOptional()
  @IsString()
  nota?: string;
}
