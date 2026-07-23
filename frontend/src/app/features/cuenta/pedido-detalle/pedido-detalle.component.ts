import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../../core/services/pedidos.service';
import { Pedido, ETIQUETAS_ESTADO } from '../../../core/models/pedido.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [CommonModule, ColonesPipe],
  templateUrl: './pedido-detalle.component.html',
  styleUrl: './pedido-detalle.component.scss',
})
export class PedidoDetalleComponent implements OnInit {
  readonly pedido = signal<Pedido | null>(null);
  readonly etiquetas = ETIQUETAS_ESTADO;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pedidosService: PedidosService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.pedidosService.miPedido(id).subscribe((pedido) => this.pedido.set(pedido));
  }
}
