import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateDireccionDto {
  @IsString()
  provincia: string;

  @IsString()
  canton: string;

  @IsString()
  distrito: string;

  @IsString()
  senasExactas: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsBoolean()
  esDefault?: boolean;
}

export class UpdateDireccionDto {
  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  canton?: string;

  @IsOptional()
  @IsString()
  distrito?: string;

  @IsOptional()
  @IsString()
  senasExactas?: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @IsBoolean()
  esDefault?: boolean;
}
