import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/tienda/tienda-lista/tienda-lista.component').then((m) => m.TiendaListaComponent),
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./features/tienda/producto-detalle/producto-detalle.component').then((m) => m.ProductoDetalleComponent),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./features/carrito/carrito.component').then((m) => m.CarritoComponent),
  },
  {
    path: 'seguimiento/:token',
    canActivate: [authGuard],
    loadComponent: () => import('./features/seguimiento/seguimiento.component').then((m) => m.SeguimientoComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: 'cuenta/ingresar',
    loadComponent: () => import('./features/cuenta/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cuenta/registro',
    loadComponent: () => import('./features/cuenta/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'cuenta/perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cuenta/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'cuenta/pedidos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cuenta/mis-pedidos/mis-pedidos.component').then((m) => m.MisPedidosComponent),
  },
  {
    path: 'cuenta/pedidos/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cuenta/pedido-detalle/pedido-detalle.component').then((m) => m.PedidoDetalleComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/admin/admin-productos/admin-productos.component').then((m) => m.AdminProductosComponent),
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./features/admin/admin-producto-editar/admin-producto-editar.component').then(
            (m) => m.AdminProductoEditarComponent,
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./features/admin/admin-pedidos/admin-pedidos.component').then((m) => m.AdminPedidosComponent),
      },
      {
        path: 'pedidos/:id',
        loadComponent: () =>
          import('./features/admin/admin-pedido-detalle/admin-pedido-detalle.component').then(
            (m) => m.AdminPedidoDetalleComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
