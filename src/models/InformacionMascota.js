const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Historial = require('./Historial');

const InformacionMascota = sequelize.define('InformacionMascota', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idH: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Historial,
      key: 'id',
    },
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peso: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  castrado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  esterilizado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
    timestamps: false,
  tableName: 'informacionMascota',
});

Historial.hasOne(InformacionMascota, { foreignKey: 'idH' });
InformacionMascota.belongsTo(Historial, { foreignKey: 'idH' });

module.exports = InformacionMascota;