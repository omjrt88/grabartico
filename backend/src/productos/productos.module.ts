import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { AtributosService } from './atributos/atributos.service';
import { AtributosController } from './atributos/atributos.controller';
import { ImagenesService } from './imagenes/imagenes.service';
import { ImagenesController } from './imagenes/imagenes.controller';
import { DisenosService } from './disenos/disenos.service';
import { DisenosController } from './disenos/disenos.controller';

@Module({
  controllers: [ProductosController, AtributosController, ImagenesController, DisenosController],
  providers: [ProductosService, AtributosService, ImagenesService, DisenosService],
  exports: [ProductosService],
})
export class ProductosModule {}
