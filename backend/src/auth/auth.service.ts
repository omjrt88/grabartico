import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Ya existe una cuenta con este correo electrónico.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        email: dto.email,
        passwordHash,
        rol: 'CLIENTE',
        cliente: {
          create: {
            nombre: dto.nombre,
            apellidos: dto.apellidos,
            telefono: dto.telefono,
          },
        },
      },
      include: { cliente: true },
    });

    return this.buildSession(usuario.id, usuario.email, usuario.rol);
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return this.buildSession(usuario.id, usuario.email, usuario.rol);
  }

  private buildSession(id: string, email: string, rol: string) {
    const payload = { sub: id, email, rol };
    return {
      accessToken: this.jwtService.sign(payload),
      usuario: { id, email, rol },
    };
  }
}
