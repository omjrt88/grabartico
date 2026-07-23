import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AtributosService } from './atributos.service';
import { CreateAtributoTipoDto, CreateAtributoValorDto, AsignarAtributoProductoDto } from './dto/atributo.dto';

@Controller()
export class AtributosController {
  constructor(private readonly atributosService: AtributosService) {}

  @Get('atributos')
  listarTipos() {
    return this.atributosService.listarTipos();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('atributos')
  crearTipo(@Body() dto: CreateAtributoTipoDto) {
    return this.atributosService.crearTipo(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('atributos/:tipoId/valores')
  crearValor(@Param('tipoId') tipoId: string, @Body() dto: CreateAtributoValorDto) {
    return this.atributosService.crearValor(tipoId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('atributos/valores/:id')
  eliminarValor(@Param('id') id: string) {
    return this.atributosService.eliminarValor(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('productos/:productoId/atributos')
  asignarAProducto(@Param('productoId') productoId: string, @Body() dto: AsignarAtributoProductoDto) {
    return this.atributosService.asignarAProducto(productoId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('productos/:productoId/atributos/:atributoValorId')
  desasignarDeProducto(
    @Param('productoId') productoId: string,
    @Param('atributoValorId') atributoValorId: string,
  ) {
    return this.atributosService.desasignarDeProducto(productoId, atributoValorId);
  }
}
