import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { designUploadOptions } from '../../common/config/multer.config';
import { DisenosService } from './disenos.service';

@Controller('productos/:productoId/disenos')
export class DisenosController {
  constructor(private readonly disenosService: DisenosService) {}

  @Get()
  listar(@Param('productoId') productoId: string) {
    return this.disenosService.listar(productoId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('diseno', designUploadOptions))
  async agregar(
    @Param('productoId') productoId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('nombre') nombre: string,
  ) {
    if (!file) {
      throw new BadRequestException('Debe adjuntar un archivo de diseño.');
    }
    const url = `/uploads/disenos/${file.filename}`;
    return this.disenosService.agregar(productoId, nombre, url);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':disenoId')
  eliminar(@Param('disenoId') disenoId: string) {
    return this.disenosService.eliminar(disenoId);
  }
}
