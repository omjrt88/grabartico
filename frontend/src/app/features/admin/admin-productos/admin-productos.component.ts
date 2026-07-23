import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/models/producto.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [FormsModule, RouterLink, ColonesPipe],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.scss',
})
export class AdminProductosComponent implements OnInit {
  readonly productos = signal<Producto[]>([]);
  readonly mostrarFormulario = signal(false);
  nuevo = { nombre: '', descripcion: '', precioBase: 0, stock: 0 };

  constructor(private readonly productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.productosService.listarAdmin().subscribe((productos) => this.productos.set(productos));
  }

  crear(): void {
    this.productosService.crear(this.nuevo).subscribe(() => {
      this.nuevo = { nombre: '', descripcion: '', precioBase: 0, stock: 0 };
      this.mostrarFormulario.set(false);
      this.cargar();
    });
  }

  desactivar(producto: Producto): void {
    this.productosService.eliminar(producto.id).subscribe(() => this.cargar());
  }
}
