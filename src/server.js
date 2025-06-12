const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const historialRoutes = require('./routes/historialRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/historial', historialRoutes);

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 5000;
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch((err) => {
  console.error('Error al conectar con la base de datos:', err);
});