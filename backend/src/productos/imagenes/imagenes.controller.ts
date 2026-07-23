import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { productImageUploadOptions } from '../../common/config/multer.config';
import { ImagenesService } from './imagenes.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('productos/:productoId/imagenes')
export class ImagenesController {
  constructor(private readonly imagenesService: ImagenesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', productImageUploadOptions))
  async agregar(
    @Param('productoId') productoId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('atributoValorIds') atributoValorIdsRaw: string | undefined,
    @Body('orden') ordenRaw: string | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo de imagen.');
    }

    const atributoValorIds: string[] = atributoValorIdsRaw ? JSON.parse(atributoValorIdsRaw) : [];
    const orden = ordenRaw ? parseInt(ordenRaw, 10) : 0;
    const url = `/uploads/productos/${file.filename}`;

    return this.imagenesService.agregar(productoId, url, atributoValorIds, orden);
  }

  @Delete(':imagenId')
  eliminar(@Param('imagenId') imagenId: string) {
    return this.imagenesService.eliminar(imagenId);
  }
}
