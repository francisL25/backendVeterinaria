// middlewares/upload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // guarda archivo en memoria (buffer)
const upload = multer({ storage });

module.exports = upload;
