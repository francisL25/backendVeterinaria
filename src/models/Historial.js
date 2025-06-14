const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historial = sequelize.define('Historial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreMascota: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  raza: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  especie: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY
  },
  sexo: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  nombreDueno: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  carnetIdentidad: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(180),
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
  tableName: "historial",
});

module.exports = Historial;