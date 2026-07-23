export interface AtributoTipo {
  id: string;
  nombre: string;
  orden: number;
  valores: AtributoValor[];
}

export interface AtributoValor {
  id: string;
  atributoTipoId: string;
  valor: string;
  codigoColorHex: string | null;
  orden: number;
  atributoTipo?: AtributoTipo;
}

export interface ProductoAtributoValor {
  id: string;
  productoId: string;
  atributoValorId: string;
  modificadorPrecio: string;
  disponible: boolean;
  atributoValor: AtributoValor;
}

export interface ImagenProductoAtributo {
  id: string;
  imagenId: string;
  atributoValorId: string;
}

export interface ImagenProducto {
  id: string;
  productoId: string;
  url: string;
  orden: number;
  atributosMapeo: ImagenProductoAtributo[];
}

export interface DisenoPredeterminado {
  id: string;
  productoId: string;
  nombre: string;
  url: string;
  activo: boolean;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precioBase: string;
  stock: number;
  activo: boolean;
  atributoValores: ProductoAtributoValor[];
  imagenes: ImagenProducto[];
  disenos: DisenoPredeterminado[];
}
