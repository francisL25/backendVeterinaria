const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuarios',
});

module.exports = Usuario;