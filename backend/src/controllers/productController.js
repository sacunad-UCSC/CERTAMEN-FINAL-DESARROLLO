const Producto = require('../models/Producto');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, brand, search, featured } = req.query;
    let query = { activo: true };

    if (category) query.categoria = category;
    if (brand) query.marca = brand;
    if (featured === 'true') query.destacado = true;
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { marca: { $regex: search, $options: 'i' } },
      ];
    }

    const productos = await Producto.find(query).sort({ createdAt: -1 });

    // Adaptador para mantener compatibilidad fluida con el frontend
    const products = productos.map((p) => ({
      _id: p._id,
      sku: p.codigoSku,
      name: p.nombre,
      category: p.categoria,
      brand: p.marca,
      description: p.descripcion,
      price: p.precio,
      originalPrice: p.precioOriginal,
      discountPercent: p.porcentajeDescuento,
      stock: p.stock,
      imageUrl: p.imagenUrl,
      specs: p.especificacionesTecnicas,
      warrantyMonths: p.garantiaMeses,
      featured: p.destacado,
    }));

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const p = await Producto.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({
      success: true,
      product: {
        _id: p._id,
        sku: p.codigoSku,
        name: p.nombre,
        category: p.categoria,
        brand: p.marca,
        description: p.descripcion,
        price: p.precio,
        originalPrice: p.precioOriginal,
        discountPercent: p.porcentajeDescuento,
        stock: p.stock,
        imageUrl: p.imagenUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, brand, price, originalPrice, stock, imageUrl, description } = req.body;
    const codigoSku = `SKU-${Date.now().toString().slice(-6)}`;

    const p = await Producto.create({
      codigoSku,
      nombre: name,
      categoria: category,
      marca: brand,
      precio,
      precioOriginal: originalPrice || price,
      stock: stock || 10,
      imagenUrl: imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
      descripcion: description || 'Componente de computación garantizado.',
    });

    res.status(201).json({ success: true, product: p });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, category, brand, price, originalPrice, stock, imageUrl, description } = req.body;
    const p = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre: name,
        categoria: category,
        marca: brand,
        precio,
        precioOriginal: originalPrice || price,
        stock,
        imagenUrl: imageUrl,
        descripcion,
      },
      { new: true, runValidators: true }
    );
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ success: true, product: p });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const p = await Producto.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};
