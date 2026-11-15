const errorHandler = (err, req, res, next) => {
  console.error('[Error Stack]', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // En producción (DevSecOps) nunca exponemos el stack trace ni datos internos del servidor
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
