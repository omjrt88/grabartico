import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidosService } from '../../../core/services/pedidos.service';
import { Pedido, ETIQUETAS_ESTADO } from '../../../core/models/pedido.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink, ColonesPipe],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.scss',
})
export class MisPedidosComponent implements OnInit {
  readonly pedidos = signal<Pedido[]>([]);
  readonly etiquetas = ETIQUETAS_ESTADO;

  constructor(private readonly pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.pedidosService.misPedidos().subscribe((pedidos) => this.pedidos.set(pedidos));
  }
}
