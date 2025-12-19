// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads/companies/logos");

// Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

export const uploadLogo = multer({ storage });
