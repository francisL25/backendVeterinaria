const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const historialRoutes = require('./routes/historialRoutes');
const historialFechaRoutes = require('./routes/historialFechaRoutes');
const authRoutes = require('./routes/authRoutes');
const documentoRoutes = require('./routes/documentoRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/historialFecha', historialFechaRoutes);
app.use('/api/documentos', documentoRoutes);



// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('Error al conectar con la base de datos:', err);
});