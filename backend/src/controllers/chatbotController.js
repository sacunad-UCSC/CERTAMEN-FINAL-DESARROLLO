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

// Función para normalizar texto (sin tildes, minúsculas y sin signos de puntuación)
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .trim();
};

const STOPWORDS_ES = new Set([
  'que', 'como', 'cual', 'cuales', 'donde', 'cuando', 'por', 'para',
  'los', 'las', 'con', 'una', 'uno', 'unos', 'unas', 'del', 'tienen', 'tiene'
]);

exports.askChatbot = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Consulta vacía' });

    const qClean = normalizeText(query);
    const qWords = qClean.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS_ES.has(w));
    const faqs = await PreguntaFrecuente.find({ activa: true });

    let bestFaq = null;
    let bestScore = 0;

    for (const f of faqs) {
      const fPregunta = normalizeText(f.pregunta);
      const fKeywords = (f.palabrasClave || []).map((k) => normalizeText(k)).filter(Boolean);

      // 1. Coincidencia directa o de subfrase
      if (fPregunta && (fPregunta.includes(qClean) || qClean.includes(fPregunta))) {
        bestFaq = f;
        break;
      }

      // 2. Coincidencia por palabras clave registradas
      const matchedKeyword = fKeywords.some((kw) => kw.length > 2 && qClean.includes(kw));
      if (matchedKeyword) {
        bestFaq = f;
        break;
      }

      // 3. Coincidencia por intersección de palabras significativas
      const fWords = fPregunta.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS_ES.has(w));
      if (fWords.length > 0 && qWords.length > 0) {
        const matches = qWords.filter((w) => fWords.includes(w));
        const score = matches.length / Math.max(fWords.length, 1);
        if (matches.length >= 1 && score > bestScore) {
          bestScore = score;
          bestFaq = f;
        }
      }
    }

    if (bestFaq) {
      return res.json({
        success: true,
        answer: bestFaq.respuesta,
        category: bestFaq.categoria,
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
    const data = { ...req.body };
    if (data.pregunta && (!data.palabrasClave || data.palabrasClave.length === 0)) {
      const words = normalizeText(data.pregunta)
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS_ES.has(w));
      data.palabrasClave = words;
    }
    const faq = await PreguntaFrecuente.create(data);
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
