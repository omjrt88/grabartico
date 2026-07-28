import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../../core/services/productos.service';
import { Producto } from '../../../../../core/models/producto.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-admin-producto-disenos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-producto-disenos.component.html',
  styleUrl: './admin-producto-disenos.component.scss',
})
export class AdminProductoDisenosComponent {
  @Input({ required: true }) producto!: Producto;
  @Input({ required: true }) productoId!: string;
  @Output() actualizado = new EventEmitter<void>();

  readonly archivosUrl = environment.archivosUrl;

  disenoSeleccionado: File | null = null;
  disenoNombre = '';

  constructor(private readonly productosService: ProductosService) {}

  onDisenoSeleccionado(evento: Event): void {
    this.disenoSeleccionado = (evento.target as HTMLInputElement).files?.[0] ?? null;
  }

  subirDiseno(): void {
    if (!this.disenoSeleccionado || !this.disenoNombre.trim()) return;
    this.productosService.subirDiseno(this.productoId, this.disenoSeleccionado, this.disenoNombre).subscribe(() => {
      this.disenoSeleccionado = null;
      this.disenoNombre = '';
      this.actualizado.emit();
    });
  }
}
