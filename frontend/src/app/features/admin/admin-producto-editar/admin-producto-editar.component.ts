import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/models/producto.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';
import { AdminProductoAtributosComponent } from './componentes/admin-producto-atributos/admin-producto-atributos.component';
import { AdminProductoImagenesComponent } from './componentes/admin-producto-imagenes/admin-producto-imagenes.component';
import { AdminProductoDisenosComponent } from './componentes/admin-producto-disenos/admin-producto-disenos.component';

@Component({
  selector: 'app-admin-producto-editar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColonesPipe,
    AdminProductoAtributosComponent,
    AdminProductoImagenesComponent,
    AdminProductoDisenosComponent,
  ],
  templateUrl: './admin-producto-editar.component.html',
  styleUrl: './admin-producto-editar.component.scss',
})
export class AdminProductoEditarComponent implements OnInit {
  readonly producto = signal<Producto | null>(null);

  edicion = { nombre: '', descripcion: '', precioBase: 0, stock: 0 };

  productoId!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productosService: ProductosService,
  ) {}

  ngOnInit(): void {
    this.productoId = this.route.snapshot.paramMap.get('id')!;
    this.cargarProducto();
  }

  cargarProducto(): void {
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
}
