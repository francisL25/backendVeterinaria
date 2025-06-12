const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historial = sequelize.define('Historial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombreMascota: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  anamnesis: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  sintomasSignos: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tratamiento: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cita: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  nombreDueño: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  doctorAtendio: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'historial',
});

module.exports = Historial;