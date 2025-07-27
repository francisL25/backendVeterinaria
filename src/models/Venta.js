const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Producto = require('./Producto');

const Venta = sequelize.define('ventas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  salida: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // ← Valor por defecto
    allowNull: false
  },
  doctor: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'ventas',
  timestamps: false,
});

// Relación con Producto
Venta.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
  onDelete: 'CASCADE',
});

module.exports = Venta;
