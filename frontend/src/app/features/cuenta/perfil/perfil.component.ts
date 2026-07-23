import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../core/services/clientes.service';
import { Cliente, Direccion } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  readonly cliente = signal<Cliente | null>(null);
  readonly mostrarNueva = signal(false);
  nuevaDireccion = { provincia: '', canton: '', distrito: '', senasExactas: '', codigoPostal: '' };

  constructor(private readonly clientesService: ClientesService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.clientesService.perfil().subscribe((cliente) => this.cliente.set(cliente));
  }

  guardarDireccion(): void {
    this.clientesService.crearDireccion({ ...this.nuevaDireccion, esDefault: false }).subscribe(() => {
      this.mostrarNueva.set(false);
      this.nuevaDireccion = { provincia: '', canton: '', distrito: '', senasExactas: '', codigoPostal: '' };
      this.cargar();
    });
  }

  marcarDefault(direccion: Direccion): void {
    this.clientesService.actualizarDireccion(direccion.id, { esDefault: true }).subscribe(() => this.cargar());
  }

  eliminarDireccion(direccion: Direccion): void {
    this.clientesService.eliminarDireccion(direccion.id).subscribe(() => this.cargar());
  }
}
