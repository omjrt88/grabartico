import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SesionAuth, Usuario } from '../models/auth.model';

const STORAGE_KEY = 'grabartico_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sesion = signal<SesionAuth | null>(this.leerSesionGuardada());

  readonly usuario = computed<Usuario | null>(() => this.sesion()?.usuario ?? null);
  readonly estaAutenticado = computed(() => !!this.sesion());
  readonly esAdmin = computed(() => this.sesion()?.usuario.rol === 'ADMIN');

  constructor(private readonly http: HttpClient) {}

  get token(): string | null {
    return this.sesion()?.accessToken ?? null;
  }

  registro(datos: {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    telefono?: string;
  }): Observable<SesionAuth> {
    return this.http
      .post<SesionAuth>(`${environment.apiUrl}/auth/registro`, datos)
      .pipe(tap((sesion) => this.guardarSesion(sesion)));
  }

  login(email: string, password: string): Observable<SesionAuth> {
    return this.http
      .post<SesionAuth>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((sesion) => this.guardarSesion(sesion)));
  }

  cerrarSesion(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sesion.set(null);
  }

  private guardarSesion(sesion: SesionAuth): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    this.sesion.set(sesion);
  }

  private leerSesionGuardada(): SesionAuth | null {
    const crudo = localStorage.getItem(STORAGE_KEY);
    return crudo ? JSON.parse(crudo) : null;
  }
}
