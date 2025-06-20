// models/Documento.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const HistorialFecha = require('./HistorialFecha');

const Documento = sequelize.define('documentos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  archivo: {
    type: DataTypes.BLOB('long'), // BYTEA en PostgreSQL
    allowNull: false,
  },
  tipo_contenido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha_subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  historial_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HistorialFecha,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'documentos',
  timestamps: false, // no tienes createdAt ni updatedAt
});

// Relación con HistorialFecha
Documento.belongsTo(HistorialFecha, {
  foreignKey: 'historial_id',
  as: 'historial',
  onDelete: 'CASCADE',
});

module.exports = Documento;
