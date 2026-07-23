import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto, AtributoTipo } from '../../../core/models/producto.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-producto-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, ColonesPipe],
  templateUrl: './admin-producto-editar.component.html',
  styleUrl: './admin-producto-editar.component.scss',
})
export class AdminProductoEditarComponent implements OnInit {
  readonly producto = signal<Producto | null>(null);
  readonly tiposAtributo = signal<AtributoTipo[]>([]);
  readonly archivosUrl = environment.archivosUrl;

  edicion = { nombre: '', descripcion: '', precioBase: 0, stock: 0 };
  nuevoModificador: Record<string, number> = {};
  nuevoTipoNombre = '';
  nuevoValorPorTipo: Record<string, string> = {};

  imagenSeleccionada: File | null = null;
  imagenAtributos: Record<string, boolean> = {};

  disenoSeleccionado: File | null = null;
  disenoNombre = '';

  private productoId!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productosService: ProductosService,
  ) {}

  ngOnInit(): void {
    this.productoId = this.route.snapshot.paramMap.get('id')!;
    this.cargarProducto();
    this.productosService.listarAtributoTipos().subscribe((tipos) => this.tiposAtributo.set(tipos));
  }

  private cargarProducto(): void {
    this.productosService.obtener(this.productoId).subscribe((producto) => {
      this.producto.set(producto);
      this.edicion = {
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? '',
        precioBase: Number(producto.precioBase),
        stock: producto.stock,
      };
    });
  }

  guardarDatos(): void {
    this.productosService.actualizar(this.productoId, this.edicion).subscribe(() => this.cargarProducto());
  }

  actualizarStock(): void {
    this.productosService.actualizarStock(this.productoId, this.edicion.stock).subscribe(() => this.cargarProducto());
  }

  yaAsignado(atributoValorId: string): boolean {
    return this.producto()?.atributoValores.some((av) => av.atributoValorId === atributoValorId) ?? false;
  }

  asignar(atributoValorId: string): void {
    const modificador = this.nuevoModificador[atributoValorId] ?? 0;
    this.productosService.asignarAtributoAProducto(this.productoId, atributoValorId, modificador).subscribe(() => {
      this.cargarProducto();
    });
  }

  crearTipo(): void {
    if (!this.nuevoTipoNombre.trim()) return;
    this.productosService.crearAtributoTipo(this.nuevoTipoNombre).subscribe(() => {
      this.nuevoTipoNombre = '';
      this.productosService.listarAtributoTipos().subscribe((tipos) => this.tiposAtributo.set(tipos));
    });
  }

  crearValor(tipoId: string): void {
    const valor = this.nuevoValorPorTipo[tipoId];
    if (!valor?.trim()) return;
    this.productosService.crearAtributoValor(tipoId, { valor }).subscribe(() => {
      this.nuevoValorPorTipo[tipoId] = '';
      this.productosService.listarAtributoTipos().subscribe((tipos) => this.tiposAtributo.set(tipos));
    });
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
      this.cargarProducto();
    });
  }

  onDisenoSeleccionado(evento: Event): void {
    this.disenoSeleccionado = (evento.target as HTMLInputElement).files?.[0] ?? null;
  }

  subirDiseno(): void {
    if (!this.disenoSeleccionado || !this.disenoNombre.trim()) return;
    this.productosService.subirDiseno(this.productoId, this.disenoSeleccionado, this.disenoNombre).subscribe(() => {
      this.disenoSeleccionado = null;
      this.disenoNombre = '';
      this.cargarProducto();
    });
  }
}
