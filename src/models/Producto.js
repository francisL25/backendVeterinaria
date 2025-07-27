const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('productos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: true, // o false si es obligatorio
    references: {
      model: 'grupo', // nombre de la tabla relacionada
      key: 'id',
    },
  },
}, {
  tableName: 'productos',
  timestamps: false,
});

module.exports = Producto;
