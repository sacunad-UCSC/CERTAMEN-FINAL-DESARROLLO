const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const createTransporter = require('../config/mailer');

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, shippingAddress, items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carro de compras está vacío' });
    }

    let subtotalCalculado = 0;
    const itemsProcesados = [];

    for (const item of items) {
      const prod = await Producto.findById(item.productId || item._id);
      if (!prod) return res.status(404).json({ message: `Producto no encontrado` });

      if (prod.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${prod.nombre}` });
      }

      prod.stock -= item.quantity;
      await prod.save();

      const st = prod.precio * item.quantity;
      subtotalCalculado += st;

      itemsProcesados.push({
        producto: prod._id,
        nombre: prod.nombre,
        imagenUrl: prod.imagenUrl,
        precio: prod.precio,
        cantidad: item.quantity,
        subtotal: st,
      });
    }

    const costoEnvio = subtotalCalculado > 100000 ? 0 : 4990;
    const totalFinal = subtotalCalculado + costoEnvio;
    const numeroPedido = `PED-${Date.now().toString().slice(-6)}`;

    const pedido = await Pedido.create({
      numeroPedido,
      usuario: req.user ? req.user._id : null,
      cliente: {
        nombre: customer.name,
        correo: customer.email.toLowerCase(),
        telefono: customer.phone,
        rut: customer.rut || '',
      },
      direccionDespacho: {
        calle: shippingAddress.address,
        ciudad: shippingAddress.city,
        region: shippingAddress.region || 'Región del Biobío',
      },
      items: itemsProcesados,
      metodoPago: paymentMethod || 'Webpay Plus (Débito/Crédito)',
      estadoPago: 'Pagado',
      estadoPedido: 'En Preparación',
      subtotal: subtotalCalculado,
      costoEnvio,
      total: totalFinal,
      numeroSeguimiento: `CHX-${Math.floor(Math.random() * 899999 + 100000)}`,
      empresaTransporte: 'Chilexpress',
    });

    try {
      const transporter = await createTransporter();
      await transporter.sendMail({
        from: `"PCStore Despachos" <${process.env.SMTP_USER || 'ventas@pcstore.cl'}>`,
        to: customer.email,
        subject: `Confirmación de Pedido #${pedido.numeroPedido} - PCStore`,
        html: `
          <h2>¡Tu pedido #${pedido.numeroPedido} ha sido recibido!</h2>
          <p>Hola ${customer.name}, hemos confirmado tu pago por un total de <strong>$${pedido.total.toLocaleString('es-CL')} CLP</strong>.</p>
          <p><strong>N° de Seguimiento:</strong> ${pedido.numeroSeguimiento} (${pedido.empresaTransporte})</p>
          <p><strong>Destino:</strong> ${pedido.direccionDespacho.calle}, ${pedido.direccionDespacho.ciudad}</p>
        `,
      });
      pedido.correoEnviado = true;
      await pedido.save();
    } catch (e) {
      console.error('[Nodemailer Pedido]:', e.message);
    }

    res.status(201).json({ success: true, order: pedido });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 });
    const orders = pedidos.map((p) => ({
      _id: p._id,
      orderNumber: p.numeroPedido,
      customer: {
        name: p.cliente.nombre,
        email: p.cliente.correo,
        phone: p.cliente.telefono,
      },
      shippingAddress: {
        address: p.direccionDespacho.calle,
        city: p.direccionDespacho.ciudad,
      },
      paymentStatus: p.estadoPago,
      orderStatus: p.estadoPedido,
      total: p.total,
      trackingNumber: p.numeroSeguimiento,
    }));
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    // Buscar tanto por usuario ObjectId como por correo electrónico en caso de órdenes creadas sin vínculo directo
    const pedidos = await Pedido.find({
      $or: [
        { usuario: req.user._id },
        { 'cliente.correo': req.user.correo.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });
    res.json({ success: true, count: pedidos.length, orders: pedidos });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estadoPedido: orderStatus, numeroSeguimiento: trackingNumber },
      { new: true }
    );
    res.json({ success: true, order: pedido });
  } catch (error) {
    next(error);
  }
};
