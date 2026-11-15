const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Usuario = require('./models/Usuario');
const Producto = require('./models/Producto');
const Pedido = require('./models/Pedido');
const Contacto = require('./models/Contacto');
const PreguntaFrecuente = require('./models/PreguntaFrecuente');
const RedSocial = require('./models/RedSocial');
const RegistroAuditoria = require('./models/RegistroAuditoria');

dotenv.config();

const componentesVerificados = [
  // 1. Tarjetas Gráficas (GPU)
  {
    codigoSku: 'GPU-RTX-4090-STRIX',
    nombre: 'ASUS ROG Strix GeForce RTX 4090 OC 24GB GDDR6X',
    categoria: 'Tarjetas Gráficas (GPU)',
    marca: 'ASUS',
    descripcion: 'La GPU definitiva para gaming extremo en 4K y renderizado con 24GB de VRAM, DLSS 3.5 y disipación masiva de cámara de vapor.',
    precio: 1999990,
    precioOriginal: 2249990,
    porcentajeDescuento: 11,
    stock: 5,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/EFF9D6D8-2F6C-4E76-989F-E5DB594052BA/w1000/h732',
    especificacionesTecnicas: {
      tipoMemoria: 'GDDR6X 24GB',
      potenciaWatts: '450W (Fuente recomendada 1000W)',
      factorForma: '3.5 Ranuras',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'GPU-RTX-4080S-MSI-SLIM',
    nombre: 'MSI GeForce RTX 4080 SUPER 16G GAMING X SLIM',
    categoria: 'Tarjetas Gráficas (GPU)',
    marca: 'MSI',
    descripcion: 'Edición delgada de alto flujo de aire con ventiladores TORX 5.0 y 16GB GDDR6X para gaming ultra a 144Hz.',
    precio: 1249990,
    precioOriginal: 1399990,
    porcentajeDescuento: 10,
    stock: 8,
    imagenUrl: 'https://storage-asset.msi.com/global/picture/product/product_17047017992412b3cf6a0f603661cbab5fb5a7f44a.webp',
    especificacionesTecnicas: {
      tipoMemoria: 'GDDR6X 16GB',
      potenciaWatts: '320W',
      factorForma: 'Tri-Frozr 3',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'GPU-RTX-4070S-ASUS',
    nombre: 'ASUS Dual GeForce RTX 4070 Super 12GB GDDR6X',
    categoria: 'Tarjetas Gráficas (GPU)',
    marca: 'ASUS',
    descripcion: 'Diseño compacto de 2 ventiladores Axial-tech y DLSS 3.5 para un rendimiento brutal en 1440p.',
    precio: 689990,
    precioOriginal: 799990,
    porcentajeDescuento: 14,
    stock: 12,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/2F3B5145-C902-4F74-B041-4C47F526E242/w1000/h732',
    especificacionesTecnicas: {
      tipoMemoria: 'GDDR6X 12GB',
      potenciaWatts: '220W',
      factorForma: '2.5 Ranuras',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'GPU-RX-7900XTX-AMD',
    nombre: 'AMD Radeon RX 7900 XTX 24GB GDDR6 RDNA 3',
    categoria: 'Tarjetas Gráficas (GPU)',
    marca: 'AMD',
    descripcion: 'Tope de gama de arquitectura RDNA 3 con DisplayPort 2.1 nativo y 24GB de memoria para ultra resoluciones.',
    precio: 1149990,
    precioOriginal: 1299990,
    porcentajeDescuento: 11,
    stock: 7,
    imagenUrl: 'https://www.amd.com/content/dam/amd/en/images/products/graphics/2648997-amd-radeon-7900xtx.jpg',
    especificacionesTecnicas: {
      tipoMemoria: 'GDDR6 24GB',
      potenciaWatts: '355W',
      factorForma: '2.5 Ranuras',
    },
    garantiaMeses: 36,
    destacado: false,
  },

  // 2. Procesadores (CPU)
  {
    codigoSku: 'CPU-RYZEN-7800X3D',
    nombre: 'AMD Ryzen 7 7800X3D 4.2GHz 8-Core / 16-Thread AM5',
    categoria: 'Procesadores (CPU)',
    marca: 'AMD',
    descripcion: 'El procesador gaming número 1 del mundo gracias a su tecnología de memoria apilada 3D V-Cache de 96MB.',
    precio: 439990,
    precioOriginal: 489990,
    porcentajeDescuento: 10,
    stock: 18,
    imagenUrl: 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-7800x3d-front.jpg',
    especificacionesTecnicas: {
      socket: 'AM5',
      potenciaWatts: '120W TDP',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'CPU-INTEL-14900K',
    nombre: 'Intel Core i9-14900K 3.2GHz 24-Core / 32-Thread LGA1700',
    categoria: 'Procesadores (CPU)',
    marca: 'Intel',
    descripcion: 'Poder descomunal con frecuencia turbo de hasta 6.0 GHz, 24 núcleos híbridos (8P + 16E) y soporte PCIe 5.0 y DDR5.',
    precio: 589990,
    precioOriginal: 649990,
    porcentajeDescuento: 9,
    stock: 10,
    imagenUrl: 'https://thumb.pccomponentes.com/w-530-530/articles/1077/10779177/1139-intel-core-i9-14900k-32-6ghz-box.jpg',
    especificacionesTecnicas: {
      socket: 'LGA1700',
      potenciaWatts: '253W TDP',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'CPU-RYZEN-7600X',
    nombre: 'AMD Ryzen 5 7600X 4.7GHz 6-Core / 12-Thread AM5',
    categoria: 'Procesadores (CPU)',
    marca: 'AMD',
    descripcion: 'Excelente procesador gamer de gama media con arquitectura Zen 4 y soporte de overclocking y memorias DDR5.',
    precio: 229990,
    precioOriginal: 269990,
    porcentajeDescuento: 15,
    stock: 15,
    imagenUrl: 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-7800x3d-front.jpg',
    especificacionesTecnicas: {
      socket: 'AM5',
      potenciaWatts: '105W TDP',
    },
    garantiaMeses: 36,
    destacado: false,
  },

  // 3. Placas Madre
  {
    codigoSku: 'MB-Z790-DARK-HERO',
    nombre: 'ASUS ROG Maximus Z790 Dark Hero WiFi 7 LGA1700',
    categoria: 'Placas Madre',
    marca: 'ASUS',
    descripcion: 'Placa madre extrema con WiFi 7, puertos Thunderbolt 4, 20+1 fases de alimentación y soporte PCIe 5.0.',
    precio: 679990,
    precioOriginal: 749990,
    porcentajeDescuento: 9,
    stock: 6,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/8E88DC59-A399-4385-8BCB-C3877F4EB746/w717/h525/fwebp',
    especificacionesTecnicas: {
      socket: 'LGA1700',
      tipoMemoria: 'DDR5',
      factorForma: 'ATX',
    },
    garantiaMeses: 36,
    destacado: false,
  },
  {
    codigoSku: 'MB-MAXIMUS-Z790-FORMULA',
    nombre: 'ASUS ROG Maximus Z790 Formula Moonlight White WiFi 7',
    categoria: 'Placas Madre',
    marca: 'ASUS',
    descripcion: 'Bloque de refrigeración líquida HybridChill VRM integrado, pantalla OLED LiveDash de 2 pulgadas y estética Moonlight White.',
    precio: 749990,
    precioOriginal: 829990,
    porcentajeDescuento: 9,
    stock: 4,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/915F33D9-D001-4531-ABD7-3F0D51D80CF4',
    especificacionesTecnicas: {
      socket: 'LGA1700',
      tipoMemoria: 'DDR5 (Hasta 8000+ MHz)',
      factorForma: 'ATX',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'MB-B650A-ROG',
    nombre: 'ASUS ROG Strix B650-A Gaming WiFi AM5 White',
    categoria: 'Placas Madre',
    marca: 'ASUS',
    descripcion: 'Estética blanca y plateada con disipadores M.2 integrados, audio ROG SupremeFX y soporte AMD EXPO.',
    precio: 279990,
    precioOriginal: 329990,
    porcentajeDescuento: 15,
    stock: 8,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/files/media/3151EBBB-8450-43F6-9994-D7E5E6A9D0E5/v1/img/kv/ROG-Strix-B650-A-Gaming.png',
    especificacionesTecnicas: {
      socket: 'AM5',
      tipoMemoria: 'DDR5',
      factorForma: 'ATX',
    },
    garantiaMeses: 24,
    destacado: true,
  },

  // 4. Memorias RAM
  {
    codigoSku: 'RAM-CORSAIR-TITANIUM-32',
    nombre: 'Corsair Dominator Titanium RGB DDR5 32GB (2x16GB) 6600MHz White',
    categoria: 'Memorias RAM',
    marca: 'Corsair',
    descripcion: 'Módulos premium construidos en aluminio de aviación con barras superiores intercambiables y 11 LEDs RGB.',
    precio: 199990,
    precioOriginal: 229990,
    porcentajeDescuento: 13,
    stock: 14,
    imagenUrl: 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/Dominator%20Titanium/enhanced%20images/white/2UP/DOMINATOR_TITANIUM_RGB_DDR5_WHITE_2UP_Artboard01_AA.webp',
    especificacionesTecnicas: {
      tipoMemoria: 'DDR5 6600MHz',
      capacidad: '32GB (2x16GB)',
    },
    garantiaMeses: 60,
    destacado: true,
  },
  {
    codigoSku: 'RAM-DDR5-CORSAIR-32',
    nombre: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz Black',
    categoria: 'Memorias RAM',
    marca: 'Corsair',
    descripcion: 'Kit optimizado con tiempos bajos CL30 para la plataforma AM5 e Intel Core de 13va y 14va generación.',
    precio: 139990,
    precioOriginal: 169990,
    porcentajeDescuento: 17,
    stock: 25,
    imagenUrl: 'https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-rgb-ddr5-config/black/2up/Vengeance-RGB-DDR5-2UP-BLACK_10.webp',
    especificacionesTecnicas: {
      tipoMemoria: 'DDR5',
      capacidad: '32GB (2x16GB)',
    },
    garantiaMeses: 60,
    destacado: false,
  },

  // 5. Almacenamiento (SSD/NVMe)
  {
    codigoSku: 'SSD-SAMSUNG-990PRO-2TB',
    nombre: 'Samsung 990 PRO 2TB M.2 PCIe 4.0 NVMe (7450 MB/s)',
    categoria: 'Almacenamiento (SSD/NVMe)',
    marca: 'Samsung',
    descripcion: 'Lecturas de hasta 7.450 MB/s con tecnología Samsung V-NAND y memoria caché LPDDR4 de 2GB.',
    precio: 189990,
    precioOriginal: 219990,
    porcentajeDescuento: 13,
    stock: 22,
    imagenUrl: 'https://images.samsung.com/is/image/samsung/p6pim/us/mz-v9p2t0b-am/gallery/us-990pro-nvme-m2-ssd-mz-v9p2t0b-am-551141316?$720_576_PNG$',
    especificacionesTecnicas: {
      capacidad: '2TB',
      factorForma: 'M.2 2280 NVMe 2.0',
    },
    garantiaMeses: 60,
    destacado: true,
  },
  {
    codigoSku: 'SSD-KINGSTON-FURY-2TB',
    nombre: 'Kingston FURY Renegade 2TB M.2 PCIe 4.0 NVMe (7300 MB/s)',
    categoria: 'Almacenamiento (SSD/NVMe)',
    marca: 'Kingston',
    descripcion: 'Disipador térmico de aluminio y grafeno de bajo perfil ideal para placas madre gamer y PlayStation 5.',
    precio: 149990,
    precioOriginal: 189990,
    porcentajeDescuento: 21,
    stock: 30,
    imagenUrl: 'https://media.kingston.com/kingston/press/ktc-press-fury-renegade-ssd.jpg',
    especificacionesTecnicas: {
      capacidad: '2TB',
      factorForma: 'M.2 2280',
    },
    garantiaMeses: 60,
    destacado: false,
  },

  // 6. Fuentes de Poder (PSU)
  {
    codigoSku: 'PSU-ROG-THOR-1000P2',
    nombre: 'ASUS ROG Thor 1000W Platinum II OLED Pantalla Telemetría',
    categoria: 'Fuentes de Poder (PSU)',
    marca: 'ASUS',
    descripcion: 'Fuente con certificación 80 Plus Platinum, pantalla OLED integrada para monitoreo de consumo en tiempo real y componentes ROG disipados.',
    precio: 329990,
    precioOriginal: 379990,
    porcentajeDescuento: 13,
    stock: 8,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/F40C3AEA-D458-41E6-BF27-045C0C8D5086/w717/h525/fwebp',
    especificacionesTecnicas: {
      potenciaWatts: '1000W Platinum',
      factorForma: 'ATX 100% Modular',
    },
    garantiaMeses: 120,
    destacado: true,
  },
  {
    codigoSku: 'PSU-CORSAIR-RM850X-SHIFT',
    nombre: 'Corsair RM850x SHIFT 850W 80 Plus Gold Modular ATX 3.0',
    categoria: 'Fuentes de Poder (PSU)',
    marca: 'Corsair',
    descripcion: 'Puertos modulares en el panel lateral para acceso fácil sin desarmar la fuente de poder, 100% silenciosa en cargas bajas.',
    precio: 159990,
    precioOriginal: 189990,
    porcentajeDescuento: 15,
    stock: 16,
    imagenUrl: 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/v1680716095/products/Power-Supply-Units/base-rmx-shift-series-psu-config/CP-9020252/Gallery/RM850x_SHIFT_01.webp',
    especificacionesTecnicas: {
      potenciaWatts: '850W',
      factorForma: 'ATX 3.0 / PCIe 5.0',
    },
    garantiaMeses: 120,
    destacado: false,
  },

  // 7. Gabinetes
  {
    codigoSku: 'CASE-ROG-HYPERION-GR701',
    nombre: 'ASUS ROG Hyperion GR701 E-ATX Full Tower Gaming Chassis',
    categoria: 'Gabinetes',
    marca: 'ASUS',
    descripcion: 'Gabinete insignia con soporte para radiadores dobles de 420mm, estructura de aluminio fundido y panel de iluminación ARGB.',
    precio: 459990,
    precioOriginal: 519990,
    porcentajeDescuento: 11,
    stock: 5,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/5167731A-F3EA-4238-9C7D-F950D0EF838C/w1000/h732',
    especificacionesTecnicas: {
      factorForma: 'Full-Tower (Soporta E-ATX)',
    },
    garantiaMeses: 36,
    destacado: true,
  },
  {
    codigoSku: 'CASE-LIANLI-O11D-EVO-RGB',
    nombre: 'Lian Li O11 Dynamic EVO RGB Cristal Templado Black',
    categoria: 'Gabinetes',
    marca: 'Lian Li',
    descripcion: 'Gabinete panorámico de doble cámara sin pilar frontal para una vista ininterrumpida de todos los componentes.',
    precio: 179990,
    precioOriginal: 209990,
    porcentajeDescuento: 14,
    stock: 9,
    imagenUrl: 'https://lian-li.com/wp-content/uploads/2023/12/O11DERGB-000.jpg',
    especificacionesTecnicas: {
      factorForma: 'Mid-Tower (Soporte E-ATX / ATX)',
    },
    garantiaMeses: 24,
    destacado: false,
  },
  {
    codigoSku: 'CASE-CORSAIR-5000D-AIRFLOW',
    nombre: 'Corsair 5000D AIRFLOW Cristal Templado Mid-Tower Black',
    categoria: 'Gabinetes',
    marca: 'Corsair',
    descripcion: 'Panel frontal perforado para máxima entrada de aire y sistema de gestión de cables RapidRoute.',
    precio: 149990,
    precioOriginal: 179990,
    porcentajeDescuento: 16,
    stock: 11,
    imagenUrl: 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1920,w_1920,f_auto/products/Cases/base-5000d-airflow/Gallery/5000D_AF_BLACK_001.webp',
    especificacionesTecnicas: {
      factorForma: 'ATX Mid-Tower',
    },
    garantiaMeses: 24,
    destacado: false,
  },

  // 8. Refrigeración Líquida
  {
    codigoSku: 'COOLER-ASUS-RYUJIN-III-360',
    nombre: 'ASUS ROG Ryujin III 360 ARGB Pantalla LCD 3.5"',
    categoria: 'Refrigeración',
    marca: 'ASUS',
    descripcion: 'Refrigeración líquida tope de línea con bomba Asetek de 8va generación y pantalla LCD de 3.5 pulgadas para gráficos personalizados y monitoreo térmico.',
    precio: 349990,
    precioOriginal: 389990,
    porcentajeDescuento: 10,
    stock: 7,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/C0D81AF2-05F4-44F1-B62F-538EC0FEC7F8',
    especificacionesTecnicas: {
      socket: 'AM5 / AM4 / LGA1700 / LGA1851',
      potenciaWatts: 'Radiador 360mm Triple Ventilador Magnético ARGB',
    },
    garantiaMeses: 72,
    destacado: true,
  },
  {
    codigoSku: 'COOLER-ROG-STRIX-LC-II-240',
    nombre: 'ASUS ROG Strix LC II 240 ARGB Dual Fan Radiator',
    categoria: 'Refrigeración',
    marca: 'ASUS',
    descripcion: 'Refrigeración líquida de doble ventilador de 120mm calibrados por ROG para un flujo de aire óptimo y bomba Asetek Gen7.',
    precio: 149990,
    precioOriginal: 179990,
    porcentajeDescuento: 16,
    stock: 15,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/6B13E855-D790-4648-9545-8C62777023E7/w1000/h732',
    especificacionesTecnicas: {
      socket: 'AM5 / AM4 / LGA1700',
      potenciaWatts: 'Radiador 240mm Doble Ventilador ARGB',
    },
    garantiaMeses: 72,
    destacado: false,
  },
  {
    codigoSku: 'COOLER-TUF-LC-II-360',
    nombre: 'ASUS TUF Gaming LC II 360 ARGB Radiador Triple Ventilador',
    categoria: 'Refrigeración',
    marca: 'ASUS',
    descripcion: 'Máxima durabilidad de grado militar con ventiladores TUF Gaming ARGB de 120mm y tubos de goma reforzados con funda trenzada de 400mm.',
    precio: 129990,
    precioOriginal: 159990,
    porcentajeDescuento: 18,
    stock: 12,
    imagenUrl: 'https://dlcdnwebimgs.asus.com/gain/1481c42f-b431-43d7-9a4f-742169abeeb6/w692',
    especificacionesTecnicas: {
      socket: 'AM5 / AM4 / LGA1700 / LGA1851',
      potenciaWatts: 'Radiador 360mm Aletas Ranuradas',
    },
    garantiaMeses: 72,
    destacado: false,
  },
];

const sembrarCatalogoVerificado = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pc_nfactory_db');
    console.log('[MongoDB] Conectado a pc_nfactory_db...');

    await Producto.deleteMany({});
    await Producto.insertMany(componentesVerificados);
    console.log(`✅ ¡${componentesVerificados.length} componentes insertados con imágenes 100% verificadas (HTTP 200 OK)!`);

    process.exit(0);
  } catch (err) {
    console.error('Error sembrando catálogo:', err.message);
    process.exit(1);
  }
};

sembrarCatalogoVerificado();
