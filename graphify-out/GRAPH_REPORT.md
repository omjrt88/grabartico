# Graph Report - .  (2026-07-28)

## Corpus Check
- 11 files · ~14,328 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 800 nodes · 1360 edges · 38 communities (33 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.9)
- Token cost: 0 input · 50,887 output

## Community Hubs (Navigation)
- Backend Controllers, Guards & Upload Config
- Frontend Product Management (Model, Service, Admin Editor)
- Backend App Bootstrap & Module Wiring
- Frontend Auth & App Shell
- Product Catalog Backend (CRUD)
- Backend Dev Dependencies
- Product Attributes Backend
- Frontend Angular Core Dependencies
- Backend Runtime Dependencies
- Order DTO & Service Backend
- Order Views & Model (Frontend)
- Dev/Test Tooling Dependencies
- Auth Backend
- Client Profile Backend
- Customer Profile (Frontend)
- Admin Product Editor Cross-Component Wiring
- Storefront Product Detail & Spec Architecture
- Design Uploads Backend
- Admin Order Status Management & Lifecycle Spec
- Backend TypeScript Config
- Shopping Cart (Frontend)
- Customer Order Tracking (Frontend)
- Admin Product Images Sub-Component
- Checkout Workflow (Frontend + Spec)
- Angular Build Asset Options
- Admin Product Attributes Sub-Component
- Angular Production Build Config
- Angular Dev Serve Config
- Angular Project Schematics
- Angular CLI Workspace Config
- Backend Nest CLI Config
- Order Tracking Page (Public)
- Angular Test/i18n Builders
- Angular Zone.js & Polyfills
- Frontend Prod Environment Config
- Spec: Dynamic Image Mapping
- Spec: Product Management
- Spec: Stock Management

## God Nodes (most connected - your core abstractions)
1. `ProductosService` - 29 edges
2. `PedidosService` - 26 edges
3. `PrismaService` - 23 edges
4. `Roles()` - 22 edges
5. `AuthService` - 19 edges
6. `AuthUser` - 18 edges
7. `CurrentUser` - 18 edges
8. `CarritoService` - 18 edges
9. `PedidosService` - 17 edges
10. `Producto` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AdminPedidoDetalleComponent` --references--> `Correos de Costa Rica (Shipping Carrier)`  [INFERRED]
  frontend/src/app/features/admin/admin-pedido-detalle/admin-pedido-detalle.component.ts → SPEC.md
- `AdminPedidoDetalleComponent` --references--> `Enviado por Correos de Costa Rica (Sent) State`  [INFERRED]
  frontend/src/app/features/admin/admin-pedido-detalle/admin-pedido-detalle.component.ts → SPEC.md
- `CheckoutComponent` --references--> `SINPE Movil Payment`  [INFERRED]
  frontend/src/app/features/checkout/checkout.component.ts → SPEC.md
- `ProductoDetalleComponent` --implements--> `Dynamic Image Carousel Filtering`  [INFERRED]
  frontend/src/app/features/tienda/producto-detalle/producto-detalle.component.ts → SPEC.md
- `ProductoDetalleComponent` --implements--> `Dynamic Product Customization`  [INFERRED]
  frontend/src/app/features/tienda/producto-detalle/producto-detalle.component.ts → SPEC.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin Producto Editar page composed of extracted child sections** — frontend_src_app_features_admin_admin_producto_editar_admin_producto_editar_component_template, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_atributos_admin_producto_atributos_component_template, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_imagenes_admin_producto_imagenes_component_template, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_disenos_admin_producto_disenos_component_template [EXTRACTED 1.00]
- **Shared image/design file-upload UI pattern** — frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_disenos_admin_producto_disenos_component_ondisenoseleccionado, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_disenos_admin_producto_disenos_component_subirdiseno, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_imagenes_admin_producto_imagenes_component_onimagenseleccionada, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_imagenes_admin_producto_imagenes_component_subirimagen [INFERRED 0.75]
- **Attribute-value assignment and tagging across product characteristics and carousel images** — frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_atributos_admin_producto_atributos_component_asignar, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_atributos_admin_producto_atributos_component_yaasignado, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_imagenes_admin_producto_imagenes_component_etiquetaatributovalor, frontend_src_app_features_admin_admin_producto_editar_componentes_admin_producto_imagenes_admin_producto_imagenes_component_editaretiquetasimagen [INFERRED 0.75]
- **Shared Cart (Carrito) State Across Header, Cart and Checkout** — frontend_src_app_shared_components_header_header_component_headercomponent, frontend_src_app_features_carrito_carrito_component_carritocomponent, frontend_src_app_features_checkout_checkout_component_checkoutcomponent [INFERRED 0.85]
- **Order Detail View Pattern (Admin, Customer, Public Tracking)** — frontend_src_app_features_admin_admin_pedido_detalle_admin_pedido_detalle_component_adminpedidodetallecomponent, frontend_src_app_features_cuenta_pedido_detalle_pedido_detalle_component_pedidodetallecomponent, frontend_src_app_features_seguimiento_seguimiento_component_seguimientocomponent [INFERRED 0.85]
- **Order Status Lifecycle Workflow** — spec_esperando_pago, spec_verificando_pago, spec_en_progreso, spec_enviado_correos_costa_rica, spec_entregado_completado [EXTRACTED 1.00]

## Communities (38 total, 5 thin omitted)

### Community 0 - "Backend Controllers, Guards & Upload Config"
Cohesion: 0.05
Nodes (48): Get, UseGuards, ClientesController, Body, Controller, Delete, Get, Param (+40 more)

### Community 1 - "Frontend Product Management (Model, Service, Admin Editor)"
Cohesion: 0.06
Nodes (20): AtributoTipo, AtributoValor, DisenoPredeterminado, ImagenProducto, ImagenProductoAtributo, Producto, ProductoAtributoValor, ProductosService (+12 more)

### Community 2 - "Backend App Bootstrap & Module Wiring"
Cohesion: 0.05
Nodes (31): AppModule, Module, AuthModule, Module, JwtPayload, JwtStrategy, Injectable, ClientesModule (+23 more)

### Community 3 - "Frontend Auth & App Shell"
Cohesion: 0.08
Nodes (19): AppComponent, Component, appConfig, routes, adminGuard(), authGuard(), authInterceptor(), RolUsuario (+11 more)

### Community 4 - "Product Catalog Backend (CRUD)"
Cohesion: 0.10
Nodes (22): CreateProductoDto, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, Type (+14 more)

### Community 5 - "Backend Dev Dependencies"
Cohesion: 0.05
Nodes (37): devDependencies, @nestjs/cli, @nestjs/schematics, @nestjs/testing, prisma, source-map-support, ts-node, @types/bcrypt (+29 more)

### Community 6 - "Product Attributes Backend"
Cohesion: 0.12
Nodes (18): AtributosController, Body, Controller, Delete, Get, Param, Post, UseGuards (+10 more)

### Community 7 - "Frontend Angular Core Dependencies"
Cohesion: 0.06
Nodes (30): @angular/animations, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router (+22 more)

### Community 8 - "Backend Runtime Dependencies"
Cohesion: 0.06
Nodes (31): dependencies, bcrypt, class-transformer, class-validator, multer, @nestjs/common, @nestjs/config, @nestjs/core (+23 more)

### Community 9 - "Order DTO & Service Backend"
Cohesion: 0.09
Nodes (15): ArrayMinSize, CrearPedidoDto, ItemPedidoDto, IsEnum, IsInt, IsOptional, IsString, Min (+7 more)

### Community 10 - "Order Views & Model (Frontend)"
Cohesion: 0.18
Nodes (12): DetallePedido, DetallePedidoAtributo, ETIQUETAS_ESTADO, HistorialEstado, Pedido, TipoGrabado, TRANSICIONES_VALIDAS, PedidoDetalleComponent (+4 more)

### Community 11 - "Dev/Test Tooling Dependencies"
Cohesion: 0.08
Nodes (24): @angular/cli, @angular/compiler-cli, @angular-devkit/build-angular, typescript, typescript, devDependencies, @angular/cli, @angular/compiler-cli (+16 more)

### Community 12 - "Auth Backend"
Cohesion: 0.12
Nodes (14): AuthController, Body, Controller, Post, AuthService, Injectable, LoginDto, IsEmail (+6 more)

### Community 13 - "Client Profile Backend"
Cohesion: 0.15
Nodes (10): ClientesService, Injectable, CreateDireccionDto, IsBoolean, IsOptional, IsString, UpdateDireccionDto, IsOptional (+2 more)

### Community 14 - "Customer Profile (Frontend)"
Cohesion: 0.16
Nodes (6): Cliente, Direccion, ClientesService, Injectable, PerfilComponent, Component

### Community 15 - "Admin Product Editor Cross-Component Wiring"
Cohesion: 0.10
Nodes (22): actualizarStock() handler, cargarProducto() handler, edicion form model, guardarDatos() handler, producto() signal, AdminProductoEditarComponent Template, asignar() handler, crearTipo() handler (+14 more)

### Community 16 - "Storefront Product Detail & Spec Architecture"
Cohesion: 0.10
Nodes (13): docker-compose postgres service, Frontend Angular CLI Project Setup, AdminLayoutComponent, Component, ProductoDetalleComponent, Component, Node.js Backend Architecture Deliverable, PostgreSQL Database Schema Deliverable (+5 more)

### Community 17 - "Design Uploads Backend"
Cohesion: 0.13
Nodes (12): DisenosController, Body, Controller, Delete, Get, Param, Post, UploadedFile (+4 more)

### Community 18 - "Admin Order Status Management & Lifecycle Spec"
Cohesion: 0.14
Nodes (10): EstadoPedido, AdminPedidoDetalleComponent, Component, AdminPedidosComponent, Component, Admin Panel Order Lifecycle State Machine, En Progreso (In Progress) State, Entregado y Completado (Delivered & Completed) State (+2 more)

### Community 19 - "Backend TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental, module, moduleResolution (+8 more)

### Community 20 - "Shopping Cart (Frontend)"
Cohesion: 0.20
Nodes (5): ItemCarrito, CarritoService, Injectable, CarritoComponent, Component

### Community 21 - "Customer Order Tracking (Frontend)"
Cohesion: 0.15
Nodes (4): PedidosService, Injectable, MisPedidosComponent, Component

### Community 22 - "Admin Product Images Sub-Component"
Cohesion: 0.18
Nodes (4): AdminProductoImagenesComponent, Component, Input, Output

### Community 23 - "Checkout Workflow (Frontend + Spec)"
Cohesion: 0.21
Nodes (6): CheckoutComponent, Component, Correos de Costa Rica (Shipping Carrier), Custom Localized Checkout Workflow (No Payment Gateway), Esperando Pago (Waiting Payment) State, SINPE Movil Payment

### Community 24 - "Angular Build Asset Options"
Cohesion: 0.25
Nodes (11): options, assets, browser, index, inlineStyleLanguage, outputPath, scripts, styles (+3 more)

### Community 25 - "Admin Product Attributes Sub-Component"
Cohesion: 0.24
Nodes (4): AdminProductoAtributosComponent, Component, Input, Output

### Community 26 - "Angular Production Build Config"
Cohesion: 0.22
Nodes (9): build, builder, configurations, defaultConfiguration, production, budgets, buildTarget, fileReplacements (+1 more)

### Community 27 - "Angular Dev Serve Config"
Cohesion: 0.22
Nodes (9): serve, development, buildTarget, extractLicenses, optimization, sourceMap, builder, configurations (+1 more)

### Community 28 - "Angular Project Schematics"
Cohesion: 0.25
Nodes (8): prefix, projectType, root, schematics, sourceRoot, frontend, style, @schematics/angular:component

### Community 29 - "Angular CLI Workspace Config"
Cohesion: 0.29
Nodes (6): cli, packageManager, newProjectRoot, projects, $schema, version

### Community 30 - "Backend Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 32 - "Angular Test/i18n Builders"
Cohesion: 0.40
Nodes (5): extract-i18n, test, builder, architect, builder

### Community 33 - "Angular Zone.js & Polyfills"
Cohesion: 0.50
Nodes (4): polyfills, zone.js, zone.js/testing, zone.js

## Knowledge Gaps
- **153 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Roles()` connect `Backend Controllers, Guards & Upload Config` to `Design Uploads Backend`, `Backend App Bootstrap & Module Wiring`, `Product Catalog Backend (CRUD)`, `Product Attributes Backend`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev/Test Tooling Dependencies` to `Frontend Angular Core Dependencies`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Angular Core Dependencies` to `Angular Zone.js & Polyfills`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend Controllers, Guards & Upload Config` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Frontend Product Management (Model, Service, Admin Editor)` be split into smaller, more focused modules?**
  _Cohesion score 0.05817028027498678 - nodes in this community are weakly interconnected._
- **Should `Backend App Bootstrap & Module Wiring` be split into smaller, more focused modules?**
  _Cohesion score 0.05387205387205387 - nodes in this community are weakly interconnected._