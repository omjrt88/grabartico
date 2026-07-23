import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../../core/services/pedidos.service';
import { Pedido, EstadoPedido, ETIQUETAS_ESTADO } from '../../../core/models/pedido.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';
import { environment } from '../../../../environments/environment';

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  ESPERANDO_PAGO: ['VERIFICANDO_PAGO'],
  VERIFICANDO_PAGO: ['EN_PROGRESO', 'ESPERANDO_PAGO'],
  EN_PROGRESO: ['ENVIADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
};

@Component({
  selector: 'app-admin-pedido-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ColonesPipe],
  templateUrl: './admin-pedido-detalle.component.html',
  styleUrl: './admin-pedido-detalle.component.scss',
})
export class AdminPedidoDetalleComponent implements OnInit {
  readonly pedido = signal<Pedido | null>(null);
  readonly etiquetas = ETIQUETAS_ESTADO;
  readonly archivosUrl = environment.archivosUrl;
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  nuevoEstado: EstadoPedido | '' = '';
  trackingCorreos = '';
  nota = '';

  private pedidoId!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pedidosService: PedidosService,
  ) {}

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id')!;
    this.cargar();
  }

  private cargar(): void {
    this.pedidosService.obtenerAdmin(this.pedidoId).subscribe((pedido) => {
      this.pedido.set(pedido);
      this.trackingCorreos = pedido.trackingCorreos ?? '';
    });
  }

  opcionesEstado(): EstadoPedido[] {
    const actual = this.pedido()?.estado;
    return actual ? TRANSICIONES_VALIDAS[actual] : [];
  }

  aplicarEstado(): void {
    if (!this.nuevoEstado) return;
    this.guardando.set(true);
    this.error.set(null);
    this.pedidosService
      .actualizarEstado(this.pedidoId, this.nuevoEstado, this.trackingCorreos || undefined, this.nota || undefined)
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.nuevoEstado = '';
          this.nota = '';
          this.cargar();
        },
        error: (err) => {
          this.guardando.set(false);
          this.error.set(err?.error?.message ?? 'No se pudo actualizar el estado.');
        },
      });
  }
}
