import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../core/services/pedidos.service';
import { Pedido, ETIQUETAS_ESTADO } from '../../core/models/pedido.model';
import { ColonesPipe } from '../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule, ColonesPipe],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.scss',
})
export class SeguimientoComponent implements OnInit {
  readonly pedido = signal<Pedido | null>(null);
  readonly cargando = signal(true);
  readonly noEncontrado = signal(false);
  readonly etiquetas = ETIQUETAS_ESTADO;
  readonly subiendo = signal(false);
  readonly mensaje = signal<string | null>(null);

  private token!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pedidosService: PedidosService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.pedidosService.seguimientoPorToken(this.token).subscribe({
      next: (pedido) => {
        this.pedido.set(pedido);
        this.cargando.set(false);
      },
      error: () => {
        this.noEncontrado.set(true);
        this.cargando.set(false);
      },
    });
  }

  onComprobante(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    this.subiendo.set(true);
    this.mensaje.set(null);
    this.pedidosService.actualizarComprobantePorToken(this.token, archivo).subscribe({
      next: (pedido) => {
        this.pedido.set(pedido);
        this.subiendo.set(false);
        this.mensaje.set('Comprobante actualizado correctamente.');
      },
      error: (err) => {
        this.subiendo.set(false);
        this.mensaje.set(err?.error?.message ?? 'No se pudo actualizar el comprobante.');
      },
    });
  }
}
