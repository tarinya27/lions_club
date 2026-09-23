import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import multer from 'multer';
import { fileURLToPath } from 'url';

const uploadsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext) ? ext : '';
    cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}${safeExt}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      cb(new Error('Upload a JPG, PNG, WEBP image, or a PDF.'));
      return;
    }
    cb(null, true);
  },
});

export { uploadsDir };
