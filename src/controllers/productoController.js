const Producto = require('../models/Producto');
const ProductoIngreso = require('../models/ProductoIngreso');
const { Op } = require('sequelize');

// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombre, fecha_vencimiento, precio_unitario, stock,  id_grupo } = req.body;
    const id = id_grupo ? parseInt(id_grupo, 10) : null;
    // Opcional: validar que el grupo exista antes de crear el producto

    const producto = await Producto.create({
      nombre,
      fecha_vencimiento,
      precio_unitario,
      stock,
      id_grupo: id,  // guardamos la clave foránea
    });

    console.log('Producto creado:', producto);

    await ProductoIngreso.create({
      id_producto: producto.id,
      ingreso: producto.stock,
      fecha: new Date(),
    });
    console.log('Ingreso inicial registrado:', producto.stock);

    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Obtener todos los productos, opcionalmente filtrando por id_grupo
const obtenerProductos = async (req, res) => {
  try {
    const { id_grupo } = req.query;
    console.log(`Obteniendo productos con id_grupo: ${id_grupo}`);
    const filtro = id_grupo ? { where: { id_grupo }, order: [['id', 'DESC']] } : { order: [['id', 'DESC']] };

    const productos = await Producto.findAll(filtro);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar producto' });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// Buscar productos por texto y opcionalmente por id_grupo
const buscarProductosPorTexto = async (req, res) => {
  try {
    const { texto, id_grupo } = req.query;
    console.log(`Búsqueda de productos con texto: ${texto} y id_grupo: ${id_grupo}`);

    if (!texto || texto.trim() === '') {
      return res.status(400).json({ error: 'El parámetro texto es obligatorio para la búsqueda' });
    }

    if (!id_grupo) {
      return res.status(400).json({ error: 'El parámetro id_grupo es obligatorio' });
    }

    const productos = await Producto.findAll({
      where: {
        [Op.and]: [
          { id_grupo: id_grupo }, // 👈 filtro por grupo
          {
            [Op.or]: [
              { nombre: { [Op.iLike]: `%${texto}%` } },
            ],
          },
        ],
      },
      order: [['id', 'ASC']],
    });

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos con el texto proporcionado' });
    }

    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha_vencimiento, precio_unitario, stock, id_grupo } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    producto.nombre = nombre || producto.nombre;
    producto.fecha_vencimiento = fecha_vencimiento || producto.fecha_vencimiento;
    producto.precio_unitario = precio_unitario || producto.precio_unitario;
    //producto.stock = stock || producto.stock;
    producto.id_grupo = id_grupo || producto.id_grupo;

    await producto.save();

    res.json({ message: 'Producto actualizado correctamente', producto });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};



module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  eliminarProducto,
  buscarProductosPorTexto,
  actualizarProducto,
};
