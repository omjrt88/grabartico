import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { TipoGrabado } from '@prisma/client';

export class ItemPedidoDto {
  @IsString()
  productoId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad: number;

  @IsArray()
  @IsString({ each: true })
  atributoValorIds: string[];

  @IsEnum(TipoGrabado)
  tipoGrabado: TipoGrabado;

  @IsOptional()
  @IsString()
  grabadoUrl?: string;

  @IsOptional()
  @IsString()
  disenoId?: string;
}

export class CrearPedidoDto {
  @IsString()
  direccionId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  items: ItemPedidoDto[];
}
