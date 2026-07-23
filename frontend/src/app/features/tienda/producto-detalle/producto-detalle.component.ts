import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { PedidosService } from '../../../core/services/pedidos.service';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { Producto } from '../../../core/models/producto.model';
import { TipoGrabado } from '../../../core/models/pedido.model';
import { ColonesPipe } from '../../../shared/pipes/colones.pipe';
import { environment } from '../../../../environments/environment';

interface GrupoAtributo {
  tipoId: string;
  nombre: string;
  valores: { id: string; valor: string; codigoColorHex: string | null; modificadorPrecio: number }[];
}

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, ColonesPipe],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.scss',
})
export class ProductoDetalleComponent implements OnInit {
  readonly producto = signal<Producto | null>(null);
  readonly cargando = signal(true);
  readonly archivosUrl = environment.archivosUrl;

  readonly seleccion = signal<Record<string, string>>({});
  readonly cantidad = signal(1);
  readonly tipoGrabado = signal<TipoGrabado>('DISENO_PREDETERMINADO');
  readonly disenoSeleccionado = signal<string | null>(null);
  readonly grabadoUrl = signal<string | null>(null);
  readonly subiendoGrabado = signal(false);
  readonly mensaje = signal<string | null>(null);

  readonly grupos = computed<GrupoAtributo[]>(() => {
    const producto = this.producto();
    if (!producto) return [];

    const porTipo = new Map<string, GrupoAtributo>();
    for (const pav of producto.atributoValores) {
      if (!pav.disponible) continue;
      const tipoId = pav.atributoValor.atributoTipoId;
      const nombreTipo = pav.atributoValor.atributoTipo?.nombre ?? '';
      if (!porTipo.has(tipoId)) {
        porTipo.set(tipoId, { tipoId, nombre: nombreTipo, valores: [] });
      }
      porTipo.get(tipoId)!.valores.push({
        id: pav.atributoValorId,
        valor: pav.atributoValor.valor,
        codigoColorHex: pav.atributoValor.codigoColorHex,
        modificadorPrecio: Number(pav.modificadorPrecio),
      });
    }
    return [...porTipo.values()];
  });

  readonly precioUnitario = computed(() => {
    const producto = this.producto();
    if (!producto) return 0;
    const seleccion = this.seleccion();
    const modificadores = producto.atributoValores
      .filter((pav) => Object.values(seleccion).includes(pav.atributoValorId))
      .reduce((acc, pav) => acc + Number(pav.modificadorPrecio), 0);
    return Number(producto.precioBase) + modificadores;
  });

  readonly imagenesVisibles = computed(() => {
    const producto = this.producto();
    if (!producto) return [];

    const tipoPorValorId = new Map<string, string>();
    for (const pav of producto.atributoValores) {
      tipoPorValorId.set(pav.atributoValorId, pav.atributoValor.atributoTipoId);
    }

    const seleccion = this.seleccion();

    return producto.imagenes.filter((imagen) => {
      if (imagen.atributosMapeo.length === 0) return true;

      const tagsPorTipo = new Map<string, Set<string>>();
      for (const mapeo of imagen.atributosMapeo) {
        const tipoId = tipoPorValorId.get(mapeo.atributoValorId);
        if (!tipoId) continue;
        if (!tagsPorTipo.has(tipoId)) tagsPorTipo.set(tipoId, new Set());
        tagsPorTipo.get(tipoId)!.add(mapeo.atributoValorId);
      }

      for (const [tipoId, valoresPermitidos] of tagsPorTipo) {
        const seleccionado = seleccion[tipoId];
        if (seleccionado && !valoresPermitidos.has(seleccionado)) {
          return false;
        }
      }
      return true;
    });
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productosService: ProductosService,
    private readonly pedidosService: PedidosService,
    private readonly carrito: CarritoService,
    public readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productosService.obtener(id).subscribe({
      next: (producto) => {
        this.producto.set(producto);
        this.cargando.set(false);

        const seleccionInicial: Record<string, string> = {};
        for (const grupo of this.grupos()) {
          if (grupo.valores.length > 0) {
            seleccionInicial[grupo.tipoId] = grupo.valores[0].id;
          }
        }
        this.seleccion.set(seleccionInicial);
      },
      error: () => this.cargando.set(false),
    });
  }

  seleccionar(tipoId: string, valorId: string): void {
    this.seleccion.update((actual) => ({ ...actual, [tipoId]: valorId }));
  }

  cambiarTipoGrabado(tipo: TipoGrabado): void {
    this.tipoGrabado.set(tipo);
    this.disenoSeleccionado.set(null);
    this.grabadoUrl.set(null);
    this.mensaje.set(null);
  }

  onArchivoGrabado(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    if (!this.auth.estaAutenticado()) {
      this.mensaje.set('Inicia sesión para subir tu diseño de grabado.');
      return;
    }

    this.subiendoGrabado.set(true);
    this.pedidosService.subirGrabado(archivo).subscribe({
      next: (respuesta) => {
        this.grabadoUrl.set(respuesta.url);
        this.subiendoGrabado.set(false);
        this.mensaje.set(null);
      },
      error: () => {
        this.subiendoGrabado.set(false);
        this.mensaje.set('No se pudo subir el archivo. Intenta con una imagen JPG, PNG o WEBP.');
      },
    });
  }

  puedeAgregar(): boolean {
    if (this.tipoGrabado() === 'DISENO_PREDETERMINADO') return !!this.disenoSeleccionado();
    return !!this.grabadoUrl();
  }

  agregarAlCarrito(): void {
    const producto = this.producto();
    if (!producto || !this.puedeAgregar()) return;

    const seleccion = this.seleccion();
    const descripcion = this.grupos()
      .map((grupo) => {
        const valorId = seleccion[grupo.tipoId];
        const valor = grupo.valores.find((v) => v.id === valorId);
        return valor ? `${grupo.nombre}: ${valor.valor}` : null;
      })
      .filter(Boolean)
      .join(', ');

    const disenoNombre =
      this.tipoGrabado() === 'DISENO_PREDETERMINADO'
        ? producto.disenos.find((d) => d.id === this.disenoSeleccionado())?.nombre
        : undefined;

    this.carrito.agregar({
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: this.cantidad(),
      atributoValorIds: Object.values(seleccion),
      atributosDescripcion: descripcion,
      precioUnitario: this.precioUnitario(),
      tipoGrabado: this.tipoGrabado(),
      grabadoUrl: this.grabadoUrl() ?? undefined,
      disenoId: this.disenoSeleccionado() ?? undefined,
      disenoNombre,
    });

    this.router.navigate(['/carrito']);
  }
}
