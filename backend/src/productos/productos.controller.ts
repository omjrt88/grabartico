import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto, UpdateStockDto } from './dto/producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  listarPublico() {
    return this.productosService.listarPublico();
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.productosService.obtener(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/todos')
  listarAdmin() {
    return this.productosService.listarAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  crear(@Body() dto: CreateProductoDto) {
    return this.productosService.crear(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.productosService.actualizar(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/stock')
  actualizarStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.productosService.actualizarStock(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.productosService.eliminar(id);
  }
}
