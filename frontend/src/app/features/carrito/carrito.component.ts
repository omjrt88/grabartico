import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { ColonesPipe } from '../../shared/pipes/colones.pipe';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, RouterLink, ColonesPipe],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
})
export class CarritoComponent {
  constructor(public readonly carrito: CarritoService) {}
}
