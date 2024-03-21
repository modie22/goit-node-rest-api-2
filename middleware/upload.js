import * as path from "node:path";
import multer from "multer";

import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const multerConfig = multer.diskStorage({
  destination: path.join(__dirname, "../", "tmp"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: multerConfig
});

export default upload;