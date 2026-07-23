import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

const UPLOAD_ROOT = process.env.UPLOAD_DIR ?? 'uploads';

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const VOUCHER_MIMES = [...IMAGE_MIMES, 'application/pdf'];

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function makeStorage(subdir: string) {
  const dest = join(UPLOAD_ROOT, subdir);
  ensureDir(dest);
  return diskStorage({
    destination: dest,
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  });
}

function makeFileFilter(allowedMimes: string[]) {
  return (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) => {
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`), false);
      return;
    }
    cb(null, true);
  };
}

export const voucherUploadOptions = {
  storage: makeStorage('vouchers'),
  fileFilter: makeFileFilter(VOUCHER_MIMES),
  limits: { fileSize: 8 * 1024 * 1024 },
};

export const engravingUploadOptions = {
  storage: makeStorage('grabados'),
  fileFilter: makeFileFilter(IMAGE_MIMES),
  limits: { fileSize: 15 * 1024 * 1024 },
};

export const productImageUploadOptions = {
  storage: makeStorage('productos'),
  fileFilter: makeFileFilter(IMAGE_MIMES),
  limits: { fileSize: 8 * 1024 * 1024 },
};

export const designUploadOptions = {
  storage: makeStorage('disenos'),
  fileFilter: makeFileFilter(IMAGE_MIMES),
  limits: { fileSize: 15 * 1024 * 1024 },
};
