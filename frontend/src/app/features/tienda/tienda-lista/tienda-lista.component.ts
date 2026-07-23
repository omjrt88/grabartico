import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/models/producto.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-tienda-lista',
  standalone: true,
  imports: [RouterLink, ColonesPipe],
  templateUrl: './tienda-lista.component.html',
  styleUrl: './tienda-lista.component.scss',
})
export class TiendaListaComponent implements OnInit {
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly archivosUrl = environment.archivosUrl;

  constructor(private readonly productosService: ProductosService) {}

  ngOnInit(): void {
    this.productosService.listar().subscribe({
      next: (productos) => {
        this.productos.set(productos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  imagenPrincipal(producto: Producto): string | null {
    return producto.imagenes[0]?.url ?? null;
  }
}
