-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('ESPERANDO_PAGO', 'VERIFICANDO_PAGO', 'EN_PROGRESO', 'ENVIADO', 'ENTREGADO');

-- CreateEnum
CREATE TYPE "TipoGrabado" AS ENUM ('SUBIDO_CLIENTE', 'DISENO_PREDETERMINADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "canton" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "senas_exactas" TEXT NOT NULL,
    "codigo_postal" TEXT,
    "es_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_base" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atributo_tipos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "atributo_tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atributo_valores" (
    "id" TEXT NOT NULL,
    "atributo_tipo_id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "codigo_color_hex" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "atributo_valores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto_atributo_valores" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "atributo_valor_id" TEXT NOT NULL,
    "modificador_precio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "producto_atributo_valores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto_atributos" (
    "id" TEXT NOT NULL,
    "imagen_id" TEXT NOT NULL,
    "atributo_valor_id" TEXT NOT NULL,

    CONSTRAINT "imagenes_producto_atributos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disenos_predeterminados" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disenos_predeterminados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "direccion_id" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'ESPERANDO_PAGO',
    "total" DECIMAL(12,2) NOT NULL,
    "comprobante_url" TEXT,
    "tracking_correos" TEXT,
    "nota_admin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "tipo_grabado" "TipoGrabado" NOT NULL,
    "grabado_url" TEXT,
    "diseno_id" TEXT,

    CONSTRAINT "detalles_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_pedido_atributos" (
    "id" TEXT NOT NULL,
    "detalle_pedido_id" TEXT NOT NULL,
    "atributo_valor_id" TEXT NOT NULL,
    "modificador_precio" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalles_pedido_atributos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL,
    "admin_id" TEXT,
    "nota" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_usuario_id_key" ON "clientes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "atributo_tipos_nombre_key" ON "atributo_tipos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "atributo_valores_atributo_tipo_id_valor_key" ON "atributo_valores"("atributo_tipo_id", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "producto_atributo_valores_producto_id_atributo_valor_id_key" ON "producto_atributo_valores"("producto_id", "atributo_valor_id");

-- CreateIndex
CREATE UNIQUE INDEX "imagenes_producto_atributos_imagen_id_atributo_valor_id_key" ON "imagenes_producto_atributos"("imagen_id", "atributo_valor_id");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atributo_valores" ADD CONSTRAINT "atributo_valores_atributo_tipo_id_fkey" FOREIGN KEY ("atributo_tipo_id") REFERENCES "atributo_tipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_atributo_valores" ADD CONSTRAINT "producto_atributo_valores_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_atributo_valores" ADD CONSTRAINT "producto_atributo_valores_atributo_valor_id_fkey" FOREIGN KEY ("atributo_valor_id") REFERENCES "atributo_valores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto_atributos" ADD CONSTRAINT "imagenes_producto_atributos_imagen_id_fkey" FOREIGN KEY ("imagen_id") REFERENCES "imagenes_producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto_atributos" ADD CONSTRAINT "imagenes_producto_atributos_atributo_valor_id_fkey" FOREIGN KEY ("atributo_valor_id") REFERENCES "atributo_valores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disenos_predeterminados" ADD CONSTRAINT "disenos_predeterminados_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_diseno_id_fkey" FOREIGN KEY ("diseno_id") REFERENCES "disenos_predeterminados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido_atributos" ADD CONSTRAINT "detalles_pedido_atributos_detalle_pedido_id_fkey" FOREIGN KEY ("detalle_pedido_id") REFERENCES "detalles_pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido_atributos" ADD CONSTRAINT "detalles_pedido_atributos_atributo_valor_id_fkey" FOREIGN KEY ("atributo_valor_id") REFERENCES "atributo_valores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
