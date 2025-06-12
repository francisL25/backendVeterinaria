const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(115),
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
    timestamps: false,
  tableName: 'usuarios',
});

module.exports = Usuario;