import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  datos = { email: '', password: '', nombre: '', apellidos: '', telefono: '' };
  readonly error = signal<string | null>(null);
  readonly enviando = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  enviar(): void {
    this.enviando.set(true);
    this.error.set(null);
    this.auth.registro(this.datos).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.enviando.set(false);
        this.error.set(err?.error?.message ?? 'No se pudo crear la cuenta.');
      },
    });
  }
}
