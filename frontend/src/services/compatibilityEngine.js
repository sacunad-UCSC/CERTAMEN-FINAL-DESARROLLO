/**
 * Motor Dinámico y Extensible de Compatibilidad, Cuello de Botella y Asistente de Reemplazo
 * NexoPC - 2026
 * 
 * Diseñado para admitir componentes nuevos agregados en cualquier momento
 * (vía Admin Panel, MongoDB o API) mediante lectura inteligente de especificaciones
 * técnicas (specs) y parsing automático de nombres/modelos.
 */

// Helper 1: Detección dinámica de Socket (AM5, AM4, LGA1700, LGA1851, etc.)
export const extractSocket = (item) => {
  if (!item) return '';
  if (item.specs?.socket) return item.specs.socket.toUpperCase().trim();
  const name = (item.name || '').toUpperCase();
  if (name.includes('AM5') || name.includes('B650') || name.includes('X670') || name.includes('7800X3D') || name.includes('7950X') || name.includes('7900X') || name.includes('7700X') || name.includes('7600X')) return 'AM5';
  if (name.includes('AM4') || name.includes('B550') || name.includes('X570') || name.includes('5800X') || name.includes('5700X') || name.includes('5600X')) return 'AM4';
  if (name.includes('LGA1700') || name.includes('Z790') || name.includes('B760') || name.includes('14900') || name.includes('14700') || name.includes('14600') || name.includes('13900') || name.includes('13700') || name.includes('13600') || name.includes('12400')) return 'LGA1700';
  if (name.includes('LGA1851') || name.includes('Z890') || name.includes('CORE ULTRA')) return 'LGA1851';
  return '';
};

// Helper 2: Detección dinámica de Tipo de Memoria RAM (DDR5, DDR4)
export const extractRamType = (item) => {
  if (!item) return '';
  if (item.specs?.tipoMemoria) {
    const mem = item.specs.tipoMemoria.toUpperCase();
    if (mem.includes('DDR5')) return 'DDR5';
    if (mem.includes('DDR4')) return 'DDR4';
  }
  const name = (item.name || '').toUpperCase();
  if (name.includes('DDR5')) return 'DDR5';
  if (name.includes('DDR4')) return 'DDR4';
  // Placas de última generación por defecto soportan DDR5 si son Z790/B650
  if (name.includes('Z790') || name.includes('B650') || name.includes('X670') || name.includes('Z890')) return 'DDR5';
  return 'DDR5';
};

// Helper 3: Detección dinámica de Potencia / Watts / TDP
export const extractWattage = (item, type) => {
  if (!item) return 0;
  
  // Si viene explícito en specs
  if (item.specs?.potenciaWatts) {
    const match = item.specs.potenciaWatts.match(/(\d+)\s*W/i);
    if (match) return parseInt(match[1], 10);
  }

  const name = (item.name || '').toLowerCase();

  // Si es fuente de poder (PSU), buscar vatios en el nombre (ej. 1000W, 850W, 750W, 650W)
  if (type === 'psu') {
    const match = name.match(/(\d{3,4})\s*w/);
    if (match) return parseInt(match[1], 10);
    if (name.includes('1000')) return 1000;
    if (name.includes('850')) return 850;
    if (name.includes('750')) return 750;
    if (name.includes('650')) return 650;
    if (name.includes('500')) return 500;
    return 650;
  }

  // Si es procesador (CPU)
  if (type === 'cpu') {
    if (name.includes('14900') || name.includes('13900')) return 253;
    if (name.includes('14700') || name.includes('13700')) return 220;
    if (name.includes('7950x') || name.includes('7900x')) return 170;
    if (name.includes('7800x3d')) return 120;
    if (name.includes('7700x') || name.includes('7600x') || name.includes('14600')) return 105;
    if (name.includes('5600') || name.includes('12400') || name.includes('13400')) return 65;
    return 105;
  }

  // Si es tarjeta gráfica (GPU)
  if (type === 'gpu') {
    if (name.includes('4090')) return 450;
    if (name.includes('4080')) return 320;
    if (name.includes('7900 xtx') || name.includes('7900xtx')) return 355;
    if (name.includes('7900 xt')) return 315;
    if (name.includes('4070 ti')) return 285;
    if (name.includes('4070 super')) return 220;
    if (name.includes('4070') || name.includes('7800 xt')) return 200;
    if (name.includes('4060 ti') || name.includes('7700 xt')) return 160;
    if (name.includes('4060') || name.includes('7600')) return 115;
    if (name.includes('3080')) return 320;
    if (name.includes('3070')) return 220;
    if (name.includes('3060')) return 170;
    return 200;
  }

  if (type === 'motherboard') return 50;
  if (type === 'ram') return 15;
  if (type === 'storage') return 10;
  if (type === 'cooler') return 25;

  return 0;
};

// Helper 4: Estimación dinámica de Tier de Rendimiento (1 a 10)
export const getCpuTier = (cpuName = '') => {
  const name = cpuName.toLowerCase();
  if (name.includes('7800x3d') || name.includes('14900k') || name.includes('7950x') || name.includes('ultra 9')) return 10;
  if (name.includes('14700k') || name.includes('7900x') || name.includes('13900k') || name.includes('ultra 7')) return 9;
  if (name.includes('7700x') || name.includes('14600k') || name.includes('13700k') || name.includes('9700x')) return 8;
  if (name.includes('7600x') || name.includes('13600k') || name.includes('13400') || name.includes('ultra 5')) return 7;
  if (name.includes('5800x3d') || name.includes('5700x') || name.includes('5800x')) return 6;
  if (name.includes('5600x') || name.includes('12400') || name.includes('5600')) return 5;
  if (name.includes('i3') || name.includes('ryzen 3')) return 4;
  return 7;
};

export const getGpuTier = (gpuName = '') => {
  const name = gpuName.toLowerCase();
  if (name.includes('4090') || name.includes('5090')) return 10;
  if (name.includes('4080') || name.includes('7900 xtx') || name.includes('5080')) return 9;
  if (name.includes('4070 ti') || name.includes('7900 xt')) return 8;
  if (name.includes('4070 super') || name.includes('4070') || name.includes('7800 xt')) return 7;
  if (name.includes('4060 ti') || name.includes('7700 xt') || name.includes('3080')) return 6;
  if (name.includes('4060') || name.includes('7600') || name.includes('3070')) return 5;
  if (name.includes('3060') || name.includes('6600') || name.includes('1660')) return 4;
  return 6;
};

export const checkCompatibility = (build, catalog = []) => {
  const issues = [];
  const warnings = [];
  const replacementSuggestions = [];
  const bottleneck = {
    percentage: 0,
    type: 'Equilibrado',
    description: 'Excelente sincronización entre CPU y Tarjeta Gráfica.',
    recommendation: '',
  };

  const { cpu, motherboard, ram, gpu, storage, psu, cooler } = build;

  // 1. Compatibilidad Socket CPU vs Placa Madre (Completamente dinámica)
  if (cpu && motherboard) {
    const cpuSocket = extractSocket(cpu);
    const mbSocket = extractSocket(motherboard);

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push(`Incompatibilidad de Socket: El procesador "${cpu.name}" requiere socket ${cpuSocket}, pero la placa madre "${motherboard.name}" tiene socket ${mbSocket}.`);

      // Buscar dinámicamente placas compatibles en el catálogo
      const compatibleMbs = catalog.filter((p) => {
        if (p.category !== 'Placas Madre' || p._id === motherboard._id) return false;
        return extractSocket(p) === cpuSocket;
      });

      if (compatibleMbs.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'motherboard',
          reason: `Cambiar placa madre por una compatible con Socket ${cpuSocket} (para conservar tu procesador)`,
          options: compatibleMbs,
        });
      }

      // Buscar dinámicamente procesadores compatibles en el catálogo
      const compatibleCpus = catalog.filter((p) => {
        if (p.category !== 'Procesadores (CPU)' || p._id === cpu._id) return false;
        return extractSocket(p) === mbSocket;
      });

      if (compatibleCpus.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'cpu',
          reason: `Cambiar procesador por uno compatible con Socket ${mbSocket} (para conservar tu placa madre)`,
          options: compatibleCpus,
        });
      }
    }
  }

  // 2. Compatibilidad Tipo de Memoria RAM vs Placa Madre
  if (ram && motherboard) {
    const ramType = extractRamType(ram);
    const mbRamType = extractRamType(motherboard);

    if (ramType.includes('DDR5') && mbRamType.includes('DDR4')) {
      issues.push('Incompatibilidad de RAM: Intentas montar memorias DDR5 en una placa madre diseñada para DDR4.');

      const compatibleRams = catalog.filter(p => p.category === 'Memorias RAM' && extractRamType(p) === 'DDR4');
      if (compatibleRams.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'ram',
          reason: 'Cambiar a memoria RAM DDR4 compatible con tu placa madre',
          options: compatibleRams,
        });
      }
    } else if (ramType.includes('DDR4') && mbRamType.includes('DDR5')) {
      issues.push('Incompatibilidad de RAM: Intentas montar memorias DDR4 en una placa madre DDR5.');

      const compatibleRams = catalog.filter(p => p.category === 'Memorias RAM' && extractRamType(p) === 'DDR5');
      if (compatibleRams.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'ram',
          reason: 'Cambiar a memoria RAM DDR5 compatible con tu placa madre',
          options: compatibleRams,
        });
      }
    }
  }

  // 3. Cálculo de Potencia Watts vs Fuente de Poder (PSU)
  let totalWatts = 60;
  totalWatts += extractWattage(cpu, 'cpu');
  totalWatts += extractWattage(gpu, 'gpu');
  totalWatts += extractWattage(motherboard, 'motherboard');
  totalWatts += extractWattage(ram, 'ram');
  totalWatts += extractWattage(storage, 'storage');
  totalWatts += extractWattage(cooler, 'cooler');

  const recommendedPsuWatts = Math.ceil((totalWatts * 1.3) / 50) * 50;

  if (psu) {
    const psuWatts = extractWattage(psu, 'psu');

    if (psuWatts < totalWatts) {
      issues.push(`Alimentación Insuficiente: Tu configuración consume aproximadamente ${totalWatts}W y la fuente seleccionada es de ${psuWatts}W. El computador se apagará bajo carga.`);
      
      const strongerPsus = catalog.filter((p) => {
        if (p.category !== 'Fuentes de Poder (PSU)' || p._id === psu._id) return false;
        return extractWattage(p, 'psu') >= recommendedPsuWatts;
      });

      if (strongerPsus.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'psu',
          reason: `Cambiar a una fuente de poder con al menos ${recommendedPsuWatts}W para alimentar la build con seguridad`,
          options: strongerPsus,
        });
      }
    } else if (psuWatts < recommendedPsuWatts) {
      warnings.push(`Margen de Potencia Ajustado: El consumo estimado es de ${totalWatts}W. Te sugerimos una fuente de al menos ${recommendedPsuWatts}W para trabajar con holgura.`);

      const recommendedPsus = catalog.filter((p) => {
        if (p.category !== 'Fuentes de Poder (PSU)' || p._id === psu._id) return false;
        return extractWattage(p, 'psu') >= recommendedPsuWatts;
      });

      if (recommendedPsus.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'psu',
          reason: `Fuentes de mayor vataje recomendadas (≥ ${recommendedPsuWatts}W)`,
          options: recommendedPsus,
        });
      }
    }
  }

  // 4. Análisis de Cuello de Botella (CPU vs GPU Bottleneck)
  if (cpu && gpu) {
    const cpuTier = getCpuTier(cpu.name);
    const gpuTier = getGpuTier(gpu.name);
    const diff = cpuTier - gpuTier;

    if (diff <= -3) {
      const pct = Math.min(38, Math.abs(diff) * 11);
      bottleneck.percentage = pct;
      bottleneck.type = 'Cuello de Botella por CPU';
      bottleneck.description = `Tu procesador limitará el rendimiento de la tarjeta gráfica en aproximadamente un ${pct}% en resoluciones 1080p y 1440p.`;
      bottleneck.recommendation = 'Te sugerimos un procesador con más núcleos o arquitectura más rápida para aprovechar la tarjeta gráfica.';

      const betterCpus = catalog.filter(p => p.category === 'Procesadores (CPU)' && getCpuTier(p.name) >= 9 && p._id !== cpu._id);
      if (betterCpus.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'cpu',
          reason: 'Mejorar procesador para eliminar el cuello de botella con tu GPU',
          options: betterCpus,
        });
      }
    } else if (diff >= 3) {
      const pct = Math.min(30, diff * 9);
      bottleneck.percentage = pct;
      bottleneck.type = 'Cuello de Botella por GPU';
      bottleneck.description = `Tu tarjeta gráfica se quedará corta frente a la potencia del procesador (aproximadamente un ${pct}%).`;
      bottleneck.recommendation = 'Para gaming exigente puedes optar por una GPU de mayor gama sin temor a desaprovechar CPU.';

      const betterGpus = catalog.filter(p => p.category === 'Tarjetas Gráficas (GPU)' && getGpuTier(p.name) >= 8 && p._id !== gpu._id);
      if (betterGpus.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'gpu',
          reason: 'Tarjetas gráficas recomendadas acordes al poder de tu procesador',
          options: betterGpus,
        });
      }
    } else {
      bottleneck.percentage = 4;
      bottleneck.type = 'Configuración Óptima y Equilibrada';
      bottleneck.description = 'El procesador y la tarjeta gráfica tienen un nivel de rendimiento parejo. No habrá pérdida perceptible de FPS ni cuello de botella.';
      bottleneck.recommendation = '¡Excelente balance de hardware!';
    }
  }

  // 5. Advertencia de Refrigeración para CPUs de gama alta
  if (cpu && (extractWattage(cpu, 'cpu') >= 120 || cpu.name.toLowerCase().includes('14900') || cpu.name.toLowerCase().includes('7800x3d'))) {
    if (!cooler) {
      warnings.push('Procesador de Alto TDP sin Refrigeración Dedicada: Requiere una refrigeración líquida de 240mm o 360mm.');

      const coolers = catalog.filter(p => p.category === 'Refrigeración');
      if (coolers.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'cooler',
          reason: 'Agregar refrigeración líquida para mantener las temperaturas bajo control',
          options: coolers,
        });
      }
    }
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    bottleneck,
    estimatedWatts: totalWatts,
    recommendedPsuWatts,
    replacementSuggestions,
  };
};
