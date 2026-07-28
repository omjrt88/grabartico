import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../../core/services/productos.service';
import { Producto } from '../../../../../core/models/producto.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-admin-producto-imagenes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-producto-imagenes.component.html',
  styleUrl: './admin-producto-imagenes.component.scss',
})
export class AdminProductoImagenesComponent {
  @Input({ required: true }) producto!: Producto;
  @Input({ required: true }) productoId!: string;
  @Output() actualizado = new EventEmitter<void>();

  readonly archivosUrl = environment.archivosUrl;

  imagenSeleccionada: File | null = null;
  imagenAtributos: Record<string, boolean> = {};

  readonly editandoImagenId = signal<string | null>(null);
  imagenEditAtributos: Record<string, boolean> = {};

  constructor(private readonly productosService: ProductosService) {}

  etiquetaAtributoValor(atributoValorId: string): string {
    const av = this.producto.atributoValores.find((a) => a.atributoValorId === atributoValorId);
    return av ? `${av.atributoValor.atributoTipo?.nombre}: ${av.atributoValor.valor}` : atributoValorId;
  }

  editarEtiquetasImagen(imagen: Producto['imagenes'][number]): void {
    const marcados = new Set(imagen.atributosMapeo.map((m) => m.atributoValorId));
    this.imagenEditAtributos = Object.fromEntries(
      this.producto.atributoValores.map((av) => [av.atributoValorId, marcados.has(av.atributoValorId)]),
    );
    this.editandoImagenId.set(imagen.id);
  }

  cancelarEdicionImagen(): void {
    this.editandoImagenId.set(null);
    this.imagenEditAtributos = {};
  }

  guardarEtiquetasImagen(imagenId: string): void {
    const atributoValorIds = Object.entries(this.imagenEditAtributos)
      .filter(([, marcado]) => marcado)
      .map(([id]) => id);

    this.productosService.actualizarImagen(this.productoId, imagenId, atributoValorIds).subscribe(() => {
      this.cancelarEdicionImagen();
      this.actualizado.emit();
    });
  }

  eliminarImagen(imagenId: string): void {
    this.productosService.eliminarImagen(this.productoId, imagenId).subscribe(() => this.actualizado.emit());
  }

  onImagenSeleccionada(evento: Event): void {
    this.imagenSeleccionada = (evento.target as HTMLInputElement).files?.[0] ?? null;
  }

  subirImagen(): void {
    if (!this.imagenSeleccionada) return;
    const atributoValorIds = Object.entries(this.imagenAtributos)
      .filter(([, marcado]) => marcado)
      .map(([id]) => id);

    this.productosService.subirImagen(this.productoId, this.imagenSeleccionada, atributoValorIds).subscribe(() => {
      this.imagenSeleccionada = null;
      this.imagenAtributos = {};
      this.actualizado.emit();
    });
  }
}
