import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    public readonly auth: AuthService,
    public readonly carrito: CarritoService,
    private readonly router: Router,
  ) {}

  salir(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/']);
  }
}
