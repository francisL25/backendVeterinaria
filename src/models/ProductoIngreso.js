const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Producto = require('./Producto');

const ProductoIngreso = sequelize.define('productos_ingreso', {
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
  ingreso: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'productos_ingreso',
  timestamps: false,
});

// Relación con Producto
ProductoIngreso.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto',
  onDelete: 'CASCADE',
});

module.exports = ProductoIngreso;
