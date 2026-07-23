import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito } from '../models/pedido.model';

const STORAGE_KEY = 'grabartico_carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly items = signal<ItemCarrito[]>(this.leerGuardado());

  readonly listaItems = computed(() => this.items());
  readonly cantidadTotal = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));
  readonly total = computed(() =>
    this.items().reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0),
  );

  agregar(item: ItemCarrito): void {
    this.items.update((actuales) => [...actuales, item]);
    this.guardar();
  }

  actualizarCantidad(indice: number, cantidad: number): void {
    this.items.update((actuales) =>
      actuales.map((item, i) => (i === indice ? { ...item, cantidad } : item)),
    );
    this.guardar();
  }

  eliminar(indice: number): void {
    this.items.update((actuales) => actuales.filter((_, i) => i !== indice));
    this.guardar();
  }

  vaciar(): void {
    this.items.set([]);
    this.guardar();
  }

  private guardar(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  }

  private leerGuardado(): ItemCarrito[] {
    const crudo = localStorage.getItem(STORAGE_KEY);
    return crudo ? JSON.parse(crudo) : [];
  }
}
