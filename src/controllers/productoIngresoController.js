const ProductoIngreso = require('../models/ProductoIngreso');
const Producto = require('../models/Producto');

// Registrar ingreso de producto (stock)
// Registrar ingreso de producto (stock)
const registrarIngreso = async (req, res) => {
  try {
    const { ingreso, fecha, precio } = req.body;
    const { id } = req.params;                     // id del producto
    console.log("Ingresos:",req.body)
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Crear ingreso y actualizar stock
    await ProductoIngreso.create({
      id_producto: id,        // <- FK correcta
      ingreso,
      fecha,
    });
    producto.stock += parseInt(ingreso, 10);
    if( precio){
      producto.precio_unitario = parseFloat(precio); // Asegurar que sea un número
    }
    
    await producto.save();

    res.status(201).json({
      mensaje: 'Ingreso registrado',
      producto_actualizado: producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar ingreso' });
  }
};


// Ver ingresos
// Ver ingresos (todos o por producto específico)
const obtenerIngresos = async (req, res) => {
  try {
    const { id } = req.params;           // puede no venir
    console.log('Obteniendo ingresos para producto ID:', id);
    const ingresos = await ProductoIngreso.findAll({
      where: id ? { id_producto: id } : {},      // filtro opcional
      order: [['fecha', 'DESC']],
    });

    res.json(ingresos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener ingresos' });
  }
};


module.exports = {
  registrarIngreso,
  obtenerIngresos,
};
