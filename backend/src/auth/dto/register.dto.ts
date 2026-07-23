import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsString()
  nombre: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
