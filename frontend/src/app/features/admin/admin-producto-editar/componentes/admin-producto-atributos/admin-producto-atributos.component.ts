import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../../core/services/productos.service';
import { AtributoTipo, Producto } from '../../../../../core/models/producto.model';

@Component({
  selector: 'app-admin-producto-atributos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-producto-atributos.component.html',
  styleUrl: './admin-producto-atributos.component.scss',
})
export class AdminProductoAtributosComponent implements OnInit {
  @Input({ required: true }) producto!: Producto;
  @Input({ required: true }) productoId!: string;
  @Output() actualizado = new EventEmitter<void>();

  tiposAtributo: AtributoTipo[] = [];
  nuevoModificador: Record<string, number> = {};
  nuevoTipoNombre = '';
  nuevoValorPorTipo: Record<string, string> = {};

  constructor(private readonly productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarTipos();
  }

  private cargarTipos(): void {
    this.productosService.listarAtributoTipos().subscribe((tipos) => (this.tiposAtributo = tipos));
  }

  yaAsignado(atributoValorId: string): boolean {
    return this.producto.atributoValores.some((av) => av.atributoValorId === atributoValorId);
  }

  asignar(atributoValorId: string): void {
    const modificador = this.nuevoModificador[atributoValorId] ?? 0;
    this.productosService.asignarAtributoAProducto(this.productoId, atributoValorId, modificador).subscribe(() => {
      this.actualizado.emit();
    });
  }

  crearTipo(): void {
    if (!this.nuevoTipoNombre.trim()) return;
    this.productosService.crearAtributoTipo(this.nuevoTipoNombre).subscribe(() => {
      this.nuevoTipoNombre = '';
      this.cargarTipos();
    });
  }

  crearValor(tipoId: string): void {
    const valor = this.nuevoValorPorTipo[tipoId];
    if (!valor?.trim()) return;
    this.productosService.crearAtributoValor(tipoId, { valor }).subscribe(() => {
      this.nuevoValorPorTipo[tipoId] = '';
      this.cargarTipos();
    });
  }
}
