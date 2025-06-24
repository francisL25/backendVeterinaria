const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta absoluta a la carpeta de destino
const carpetaDestino = path.join(__dirname, '..', 'uploads', 'docs');

// Asegurarse de que exista la carpeta
if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, carpetaDestino); // Carpeta de destino
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // .pdf
    const baseName = path.basename(file.originalname, ext); // sin extensión
    const nombreFinal = `${baseName}-${timestamp}${ext}`;
    cb(null, nombreFinal); // Nombre final del archivo
  }
});

const upload = multer({
  storage,
  limits: {
    files: 10, // máximo 10 archivos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // aceptar archivo
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false); // rechazar
    }
  },
});

module.exports = upload;
