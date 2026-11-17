import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Tag, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

export default function HeroBanner({ products = [], onSelectCategory, onNavigate, onOpenDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isPaused, setIsPaused] = useState(false);

  // Filtrar productos con imagen válida
  const bannerProducts = products.length > 0 ? products.slice(0, 8) : [];

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % bannerProducts.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + bannerProducts.length) % bannerProducts.length);
  };

  const handleSelectIndex = (idx) => {
    setDirection(idx > currentIndex ? 'right' : 'left');
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (bannerProducts.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [bannerProducts.length, isPaused, currentIndex]);

  const currentProduct = bannerProducts[currentIndex];

  if (!currentProduct) {
    return (
      <div className="hero-banner">
        <div className="hero-box">
          <div className="hero-content">
            <h4>Especial Hardware Gaming & Workstation</h4>
            <h1>COMPONENTES DE ALTO RENDIMIENTO</h1>
            <p>Encuentra las mejores tarjetas gráficas, procesadores y periféricos en NexoPC.</p>
          </div>
        </div>
      </div>
    );
  }

  const animationClass = direction === 'right' ? 'animate-slide-right' : 'animate-slide-left';

  return (
    <div
      className="hero-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ userSelect: 'none' }}
    >
      <div className="hero-box hero-responsive-box">
        {/* Botón Flecha Izquierda (Visible en pantallas medianas y grandes) */}
        <button
          onClick={handlePrev}
          className="hero-arrow-btn hero-arrow-left"
          title="Componente anterior"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Botón Flecha Derecha (Visible en pantallas medianas y grandes) */}
        <button
          onClick={handleNext}
          className="hero-arrow-btn hero-arrow-right"
          title="Siguiente componente"
        >
          <ChevronRight size={22} />
        </button>

        {/* Fondo con imagen difuminada */}
        <div
          key={`bg-${currentProduct._id}`}
          className="hero-bg-glow"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0, 142, 204, 0.38) 0%, transparent 72%), url(${currentProduct.imageUrl})`,
          }}
        />

        {/* Lado Izquierdo: Contenido con Animación de Desplazo */}
        <div
          key={`content-${currentIndex}`}
          className={`hero-content ${animationClass}`}
        >
          {/* Badge de Categoría y Marca */}
          <div className="hero-category-badge">
            <Sparkles size={14} />
            <span>{currentProduct.category} &bull; {currentProduct.brand}</span>
          </div>

          {/* Título Principal Desplazable */}
          <h1
            className="hero-main-title"
            onClick={() => onOpenDetail && onOpenDetail(currentProduct)}
            title="Haz clic para ver especificaciones técnicas completas"
          >
            {currentProduct.name}
          </h1>

          {/* Descripción con desplazamiento */}
          <p className="hero-description">
            {currentProduct.description ||
              'Tecnología de punta con despacho rápido a todo Chile y garantía oficial directa en NexoPC.'}
          </p>

          {/* Fila de Precios y Botones */}
          <div className="hero-actions-row">
            <div className="hero-prices">
              <span className="hero-current-price">
                ${currentProduct.price?.toLocaleString('es-CL')}
              </span>
              {currentProduct.originalPrice > currentProduct.price && (
                <span className="hero-old-price">
                  ${currentProduct.originalPrice?.toLocaleString('es-CL')}
                </span>
              )}
            </div>

            <div className="hero-buttons-group">
              <button
                className="btn-primary hero-btn-cat"
                onClick={() => onSelectCategory && onSelectCategory(currentProduct.category)}
              >
                Ver {currentProduct.category.split(' ')[0]}
                <ArrowRight size={16} />
              </button>

              {onNavigate && (
                <button
                  className="hero-btn-builder"
                  onClick={() => onNavigate('builder')}
                >
                  <Wrench size={14} /> Arma tu PC
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Tarjeta de Hardware Flotante con Animación */}
        <div
          key={`card-wrap-${currentIndex}`}
          className="animate-card-slide hero-floating-card-wrap"
        >
          <div
            className="hero-floating-card"
            onClick={() => onOpenDetail && onOpenDetail(currentProduct)}
            title="Haz clic para ver fotos y especificaciones técnicas completas"
          >
            {currentProduct.discountPercent > 0 && (
              <div className="hero-card-discount">
                <Tag size={12} />
                -{currentProduct.discountPercent}% OFF
              </div>
            )}

            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              className="hero-card-img"
            />

            <span className="hero-card-name">
              {currentProduct.name}
            </span>
          </div>
        </div>

        {/* Indicadores inferiores (Puntos de desplazamiento) */}
        <div className="hero-indicators">
          {bannerProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectIndex(idx)}
              className={`hero-dot ${currentIndex === idx ? 'active' : ''}`}
              title={`Ir al componente ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
