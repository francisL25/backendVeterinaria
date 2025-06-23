const multer = require('multer');

const storage = multer.memoryStorage();

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
