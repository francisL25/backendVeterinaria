const Venta = require('../models/Venta');
const Producto = require('../models/Producto');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../config/database');

// Plugins de zona horaria
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

const ZONA = 'America/La_Paz';

/* ---------- POST /registrarVenta/:id ---------- */
const registrarVenta = async (req, res) => {
  try {
    const { salida, precio, doctor } = req.body;
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (producto.stock < salida) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const cantidad = parseInt(salida, 10);
    const precioUnitario = parseFloat(precio);

    if (isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    if (isNaN(precioUnitario) || precioUnitario <= 0) {
      return res.status(400).json({ error: 'Precio inválido' });
    }

    const total = cantidad * precioUnitario;

    await Venta.create({
      id_producto: id,
      salida: cantidad,
      precio: total,
      doctor,
      // fecha se guarda automáticamente si está en el modelo
    });

    producto.stock -= cantidad;
    await producto.save();

    res.status(201).json({
      mensaje: 'Venta registrada',
      producto_actualizado: producto,
    });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    res.status(500).json({ error: 'Error al registrar venta' });
  }
};

/* ---------- GET /obtenerVentas/:id? ---------- */
const obtenerVentas = async (req, res) => {
  try {
    const { id } = req.params;
    const where = id ? { id_producto: id } : {};

    const ventas = await Venta.findAll({
      where,
      order: [['id', 'DESC']],
    });

    const haceUnMes = dayjs().subtract(1, 'month').toDate();

    const total = await Venta.sum('precio', {
      where: {
        ...where,
        fecha: {
          [Op.gte]: haceUnMes
        }
      }
    });

    res.json({
      ventas,
      total: total || 0,
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

/* ---------- GET /ventas/reporte-mensual ---------- */
const reportePorFecha = async (req, res) => {
  let { dia, mes, anio, inicio, fin } = req.query;
  console.log(`Parámetros recibidos: dia=${dia}, mes=${mes}, anio=${anio}, inicio=${inicio}, fin=${fin}`);

  try {
    let fechaInicio, fechaFin;

    if (inicio && fin) {
      fechaInicio = dayjs.tz(inicio, ZONA).startOf('day').toDate();
      fechaFin = dayjs.tz(fin, ZONA).endOf('day').toDate();
    } else if (dia && mes && anio) {
      const fechaBase = dayjs.tz(`${anio}-${mes}-${dia}`, ZONA);
      fechaInicio = fechaBase.startOf('day').toDate();
      fechaFin = fechaBase.endOf('day').toDate();
    } else {
      return res.status(400).json({ error: 'Parámetros insuficientes. Usa dia/mes/anio o inicio/fin' });
    }

    const detalle = await Venta.findAll({
      attributes: [
        [sequelize.col('producto.nombre'), 'producto'],
        'doctor',
        [sequelize.fn('SUM', sequelize.col('salida')), 'nro_vendidos'],
        [sequelize.fn('SUM', sequelize.col('precio')), 'total_bs'],
      ],
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      include: [{
        model: Producto,
        as: 'producto',
        attributes: [],
      }],
      group: ['producto.nombre', 'doctor'],
      raw: true,
    });

    const total = await Venta.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('precio')), 'total_general_bs']],
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      raw: true,
    });

    res.json({
      desde: dayjs(fechaInicio).format('YYYY-MM-DD'),
      hasta: dayjs(fechaFin).format('YYYY-MM-DD'),
      detalle,
      total_general: total?.total_general_bs || 0,
    });

  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
  }
};

module.exports = {
  reportePorFecha,
  registrarVenta,
  obtenerVentas,
};
