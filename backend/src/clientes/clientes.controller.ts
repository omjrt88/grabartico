import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { ClientesService } from './clientes.service';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { CreateDireccionDto, UpdateDireccionDto } from './dto/direccion.dto';

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get('perfil')
  perfil(@CurrentUser() user: AuthUser) {
    return this.clientesService.getPerfil(user.id);
  }

  @Patch('perfil')
  actualizarPerfil(@CurrentUser() user: AuthUser, @Body() dto: UpdateClienteDto) {
    return this.clientesService.actualizarPerfil(user.id, dto);
  }

  @Get('direcciones')
  direcciones(@CurrentUser() user: AuthUser) {
    return this.clientesService.listarDirecciones(user.id);
  }

  @Post('direcciones')
  crearDireccion(@CurrentUser() user: AuthUser, @Body() dto: CreateDireccionDto) {
    return this.clientesService.crearDireccion(user.id, dto);
  }

  @Patch('direcciones/:id')
  actualizarDireccion(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateDireccionDto,
  ) {
    return this.clientesService.actualizarDireccion(user.id, id, dto);
  }

  @Delete('direcciones/:id')
  eliminarDireccion(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.clientesService.eliminarDireccion(user.id, id);
  }
}
