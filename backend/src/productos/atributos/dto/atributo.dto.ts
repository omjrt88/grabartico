import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAtributoTipoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orden?: number;
}

export class CreateAtributoValorDto {
  @IsString()
  valor: string;

  @IsOptional()
  @IsString()
  codigoColorHex?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orden?: number;
}

export class AsignarAtributoProductoDto {
  @IsString()
  atributoValorId: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  modificadorPrecio?: number;
}
