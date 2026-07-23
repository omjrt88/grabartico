import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PedidosService } from '../../../core/services/pedidos.service';
import { Pedido, EstadoPedido, ETIQUETAS_ESTADO } from '../../../core/models/pedido.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ColonesPipe],
  templateUrl: './admin-pedidos.component.html',
  styleUrl: './admin-pedidos.component.scss',
})
export class AdminPedidosComponent implements OnInit {
  readonly pedidos = signal<Pedido[]>([]);
  readonly etiquetas = ETIQUETAS_ESTADO;
  readonly estados = Object.keys(ETIQUETAS_ESTADO) as EstadoPedido[];
  filtro: EstadoPedido | '' = '';

  constructor(private readonly pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.pedidosService.listarAdmin(this.filtro || undefined).subscribe((pedidos) => this.pedidos.set(pedidos));
  }
}
