const { describe, it } = require('node:test');
const assert = require('node:assert');

// Motor de Compatibilidad y Asistente de Reemplazo
const checkCompatibility = (build, catalog = []) => {
  const issues = [];
  const warnings = [];
  const replacementSuggestions = [];
  const bottleneck = {
    percentage: 0,
    type: 'Equilibrado',
    description: '',
    recommendation: '',
  };

  const { cpu, motherboard, ram, gpu, psu } = build;

  if (cpu && motherboard) {
    const cpuSocket = cpu.socket || (cpu.name.includes('AM5') ? 'AM5' : 'LGA1700');
    const mbSocket = motherboard.socket || (motherboard.name.includes('AM5') ? 'AM5' : 'LGA1700');

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push(`Incompatibilidad de Socket: ${cpuSocket} vs ${mbSocket}`);

      const compatibleMbs = catalog.filter(p => p.category === 'Placas Madre' && (p.socket === cpuSocket || p.name.includes(cpuSocket)));
      if (compatibleMbs.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'motherboard',
          reason: `Cambiar placa madre por una compatible con Socket ${cpuSocket}`,
          options: compatibleMbs,
        });
      }
    }
  }

  let totalWatts = 60;
  if (cpu) totalWatts += cpu.watts || 120;
  if (gpu) totalWatts += gpu.watts || 200;

  const recommendedPsu = Math.ceil((totalWatts * 1.3) / 50) * 50;

  if (psu) {
    const psuWatts = psu.watts || 650;
    if (psuWatts < totalWatts) {
      issues.push(`Alimentación Insuficiente: ${totalWatts}W consumo vs ${psuWatts}W fuente`);
      const strongerPsus = catalog.filter(p => p.category === 'Fuentes de Poder (PSU)' && p.watts >= recommendedPsu);
      if (strongerPsus.length > 0) {
        replacementSuggestions.push({
          targetSlot: 'psu',
          reason: `Cambiar fuente por una de al menos ${recommendedPsu}W`,
          options: strongerPsus,
        });
      }
    }
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    replacementSuggestions,
    bottleneck,
    estimatedWatts: totalWatts,
    recommendedPsu,
  };
};

describe('Motor de Compatibilidad y Asistente de Reemplazo NexoPC', () => {
  const mockCatalog = [
    { _id: '1', name: 'ASUS ROG Strix B650-A Gaming WiFi AM5', category: 'Placas Madre', socket: 'AM5', price: 279990 },
    { _id: '2', name: 'ASUS ROG Maximus Z790 Dark Hero LGA1700', category: 'Placas Madre', socket: 'LGA1700', price: 679990 },
    { _id: '3', name: 'ASUS ROG Thor 1000W Platinum II', category: 'Fuentes de Poder (PSU)', watts: 1000, price: 329990 },
    { _id: '4', name: 'Corsair RM850x 850W Gold', category: 'Fuentes de Poder (PSU)', watts: 850, price: 159990 },
  ];

  it('Debe detectar socket erróneo y entregar sugerencias exactas de cambio de placa madre', () => {
    const build = {
      cpu: { name: 'AMD Ryzen 7 7800X3D AM5', socket: 'AM5' },
      motherboard: { name: 'ASUS ROG Maximus Z790 LGA1700', socket: 'LGA1700' },
    };
    const res = checkCompatibility(build, mockCatalog);
    assert.strictEqual(res.isCompatible, false);
    assert.strictEqual(res.replacementSuggestions.length, 1);
    assert.strictEqual(res.replacementSuggestions[0].targetSlot, 'motherboard');
    assert.ok(res.replacementSuggestions[0].options.some(o => o.socket === 'AM5'));
  });

  it('Debe sugerir fuentes de poder de alto vataje cuando la fuente actual no cubre el consumo', () => {
    const build = {
      cpu: { name: 'i9 14900K', watts: 253 },
      gpu: { name: 'RTX 4090', watts: 450 },
      psu: { name: 'Fuente 500W', watts: 500 },
    };
    const res = checkCompatibility(build, mockCatalog);
    assert.strictEqual(res.isCompatible, false);
    assert.ok(res.replacementSuggestions.some(s => s.targetSlot === 'psu'));
    const psuOptions = res.replacementSuggestions.find(s => s.targetSlot === 'psu').options;
    assert.ok(psuOptions.every(p => p.watts >= 850));
  });
});
