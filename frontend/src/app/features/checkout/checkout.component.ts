import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientesService } from '../../core/services/clientes.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Direccion } from '../../core/models/cliente.model';
import { ColonesPipe } from '../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ColonesPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  readonly direcciones = signal<Direccion[]>([]);
  readonly direccionId = signal<string | null>(null);
  readonly mostrarNuevaDireccion = signal(false);
  readonly comprobante = signal<File | null>(null);
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  nuevaDireccion = { provincia: '', canton: '', distrito: '', senasExactas: '', codigoPostal: '' };

  constructor(
    private readonly clientesService: ClientesService,
    private readonly pedidosService: PedidosService,
    public readonly carrito: CarritoService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.carrito.listaItems().length === 0) {
      this.router.navigate(['/carrito']);
      return;
    }
    this.clientesService.direcciones().subscribe((direcciones) => {
      this.direcciones.set(direcciones);
      const porDefecto = direcciones.find((d) => d.esDefault) ?? direcciones[0];
      if (porDefecto) this.direccionId.set(porDefecto.id);
      if (direcciones.length === 0) this.mostrarNuevaDireccion.set(true);
    });
  }

  guardarNuevaDireccion(): void {
    this.clientesService.crearDireccion({ ...this.nuevaDireccion, esDefault: this.direcciones().length === 0 }).subscribe({
      next: (direccion) => {
        this.direcciones.update((actuales) => [...actuales, direccion]);
        this.direccionId.set(direccion.id);
        this.mostrarNuevaDireccion.set(false);
      },
      error: () => this.error.set('No se pudo guardar la dirección.'),
    });
  }

  onComprobante(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    this.comprobante.set(archivo ?? null);
  }

  puedeConfirmar(): boolean {
    return !!this.direccionId() && !!this.comprobante() && !this.enviando();
  }

  confirmar(): void {
    if (!this.puedeConfirmar()) return;
    this.enviando.set(true);
    this.error.set(null);

    this.pedidosService.crear(this.direccionId()!, this.carrito.listaItems(), this.comprobante()!).subscribe({
      next: (pedido) => {
        this.carrito.vaciar();
        this.router.navigate(['/cuenta/pedidos', pedido.id]);
      },
      error: (err) => {
        this.enviando.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo procesar el pedido.');
      },
    });
  }
}
