import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PedidosSeguimientoController } from './pedidos-seguimiento.controller';

@Module({
  providers: [PedidosService],
  controllers: [PedidosController, PedidosSeguimientoController],
})
export class PedidosModule {}
