const PreguntaFrecuente = require('../models/PreguntaFrecuente');

exports.getFaqs = async (req, res, next) => {
  try {
    const faqs = await PreguntaFrecuente.find({ activa: true }).select('-__v');
    const adaptadas = faqs.map((f) => ({
      _id: f._id,
      category: f.categoria,
      question: f.pregunta,
      answer: f.respuesta,
    }));
    res.json({ success: true, count: adaptadas.length, faqs: adaptadas });
  } catch (error) {
    next(error);
  }
};

exports.askChatbot = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Consulta vacía' });

    const textoLimpio = query.toLowerCase().trim();
    const faqs = await PreguntaFrecuente.find({ activa: true });

    let match = faqs.find((f) => {
      const palabraCoincide = f.palabrasClave.some((k) => textoLimpio.includes(k.toLowerCase()));
      const preguntaCoincide = f.pregunta.toLowerCase().includes(textoLimpio);
      return palabraCoincide || preguntaCoincide;
    });

    if (match) {
      return res.json({
        success: true,
        answer: match.respuesta,
        category: match.categoria,
      });
    }

    return res.json({
      success: true,
      answer:
        'No encontré una respuesta exacta para tu consulta. Puedes seleccionar una opción del menú o hacer clic en "Solicitar contacto con un ejecutivo" para recibir asistencia personalizada.',
      options: [
        '¿Qué garantía tienen los componentes de PC?',
        '¿Cuánto tardan los envíos a regiones?',
        '¿Cuáles son los medios de pago disponibles?',
        'Solicitar contacto con un ejecutivo',
      ],
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllFaqsAdmin = async (req, res, next) => {
  try {
    const faqs = await PreguntaFrecuente.find().sort({ createdAt: -1 });
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

exports.createFaq = async (req, res, next) => {
  try {
    const faq = await PreguntaFrecuente.create(req.body);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

exports.updateFaq = async (req, res, next) => {
  try {
    const faq = await PreguntaFrecuente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

exports.deleteFaq = async (req, res, next) => {
  try {
    await PreguntaFrecuente.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ eliminada' });
  } catch (error) {
    next(error);
  }
};
