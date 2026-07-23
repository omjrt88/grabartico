import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'colones', standalone: true })
export class ColonesPipe implements PipeTransform {
  private readonly formateador = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  });

  transform(valor: string | number | null | undefined): string {
    if (valor === null || valor === undefined) {
      return this.formateador.format(0);
    }
    return this.formateador.format(Number(valor));
  }
}
