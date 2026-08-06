import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { storage as cloudinaryStorage } from "../config/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../uploads");
const isProd = process.env.NODE_ENV === "production";

// Production uploads go straight to Cloudinary. In development we write to
// server/uploads/ instead (served statically — see server.js) so local work
// isn't blocked on Cloudinary account/quota issues. Either way, req.file(s)
// end up with a .path the rest of the app can use directly as a URL.
let storage;
if (isProd) {
  storage = cloudinaryStorage;
} else {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const baseUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// Local disk storage leaves req.file.path as an absolute filesystem path;
// Cloudinary storage already leaves it as a secure_url. Normalize the former
// to a URL so controllers (which just read req.file.path) don't need to care.
const normalizePaths = (req, res, next) => {
  if (!isProd) {
    if (req.file) req.file.path = `/uploads/${req.file.filename}`;
    if (req.files) {
      Object.values(req.files).flat().forEach((f) => {
        f.path = `/uploads/${f.filename}`;
      });
    }
  }
  next();
};

const upload = {
  single: (field) => [baseUpload.single(field), normalizePaths],
  fields: (fieldsConfig) => [baseUpload.fields(fieldsConfig), normalizePaths],
};

export default upload;
