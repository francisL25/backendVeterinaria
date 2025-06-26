const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Historial = require('./Historial');

const HistorialFecha = sequelize.define('HistorialFecha', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idH: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Historial,
      key: 'id'
    }
  },
  nombreMascota: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  raza: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  especie: {
    type: DataTypes.STRING(120),
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
  peso: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  castrado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  esterilizado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  seniaParticular: {
    type: DataTypes.TEXT
  },
  anamnesis: {
    type: DataTypes.TEXT
  },
  sintomasSignos: {
    type: DataTypes.TEXT
  },
  tratamiento: {
    type: DataTypes.TEXT
  },
  diagnostico: {
    type: DataTypes.TEXT
  },
  cita: {
    type: DataTypes.DATE,
    allowNull: true
  },
  doctorAtendio: {
    type: DataTypes.STRING(60)
  },
  fechaHistorial: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
    receta: {
    type: DataTypes.TEXT
  },
    recomendacion: {
    type: DataTypes.TEXT
  }
}, {
  tableName: "historialFecha",
});

// Relación con Historial
HistorialFecha.belongsTo(Historial, { foreignKey: 'idH', onDelete: 'CASCADE' });

module.exports = HistorialFecha;