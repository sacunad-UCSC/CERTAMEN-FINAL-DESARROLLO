from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['pc_nfactory_db']

specs_enrichment = {
    "GPU-RTX-4090-STRIX": {
        "socket": "",
        "tipoMemoria": "GDDR6X 24GB (384-bit)",
        "potenciaWatts": "450W (Fuente recomendada 1000W)",
        "factorForma": "3.5 Ranuras (357.6 x 149.3 x 70.1 mm)",
        "capacidad": "24GB VRAM",
        "interfaz": "PCI Express 4.0 x16",
        "frecuenciaBoost": "2640 MHz (OC Mode)",
        "salidasVideo": "2x HDMI 2.1a, 3x DisplayPort 1.4a",
        "nucleosCuda": "16384 Núcleos",
        "tecnologias": "NVIDIA DLSS 3.5, Ray Tracing Gen 3, Reflex"
    },
    "GPU-RTX-4080S-MSI-SLIM": {
        "socket": "",
        "tipoMemoria": "GDDR6X 16GB (256-bit)",
        "potenciaWatts": "320W (Fuente recomendada 750W-850W)",
        "factorForma": "Tri-Frozr 3 (322 x 136 x 62 mm)",
        "capacidad": "16GB VRAM",
        "interfaz": "PCI Express 4.0 x16",
        "frecuenciaBoost": "2595 MHz",
        "salidasVideo": "1x HDMI 2.1a, 3x DisplayPort 1.4a",
        "nucleosCuda": "10240 Núcleos",
        "tecnologias": "NVIDIA DLSS 3.5, Ray Tracing Gen 3, TORX Fan 5.0"
    },
    "GPU-RTX-4070S-ASUS": {
        "socket": "",
        "tipoMemoria": "GDDR6X 12GB (192-bit)",
        "potenciaWatts": "220W (Fuente recomendada 650W)",
        "factorForma": "2.56 Ranuras (267.01 x 133.94 x 51.13 mm)",
        "capacidad": "12GB VRAM",
        "interfaz": "PCI Express 4.0 x16",
        "frecuenciaBoost": "2505 MHz (OC Mode)",
        "salidasVideo": "1x HDMI 2.1a, 3x DisplayPort 1.4a",
        "nucleosCuda": "7168 Núcleos",
        "tecnologias": "NVIDIA DLSS 3.5, Dual Fan Axial-tech, 0dB Tech"
    },
    "GPU-RX-7900XTX-AMD": {
        "socket": "",
        "tipoMemoria": "GDDR6 24GB (384-bit)",
        "potenciaWatts": "355W (Fuente recomendada 800W)",
        "factorForma": "2.5 Ranuras (287 mm longitud)",
        "capacidad": "24GB VRAM",
        "interfaz": "PCI Express 4.0 x16",
        "frecuenciaBoost": "2500 MHz (Game Clock 2300 MHz)",
        "salidasVideo": "1x HDMI 2.1, 2x DisplayPort 2.1, 1x USB-C",
        "unidadesComputo": "96 Compute Units RDNA 3",
        "tecnologias": "AMD FSR 3.1, AMD HYPR-RX, DisplayPort 2.1 nativo"
    },
    "CPU-RYZEN-7800X3D": {
        "socket": "AM5",
        "potenciaWatts": "120W TDP",
        "factorForma": "LGA 1718 (AM5)",
        "tipoMemoria": "DDR5 hasta 5200 MT/s (EXPO compatible)",
        "capacidad": "Cache L3: 96MB 3D V-Cache (104MB Total)",
        "nucleosHilos": "8 Núcleos / 16 Hilos",
        "frecuenciaBase": "4.2 GHz (Boost hasta 5.0 GHz)",
        "litografia": "TSMC 5nm FinFET",
        "graficosIntegrados": "AMD Radeon Graphics (2 CU RDNA 2)"
    },
    "CPU-INTEL-14900K": {
        "socket": "LGA1700",
        "potenciaWatts": "125W Base / 253W Max Turbo",
        "factorForma": "LGA 1700",
        "tipoMemoria": "DDR5 5600 MT/s & DDR4 3200 MT/s",
        "capacidad": "Cache Inteligente Intel: 36MB (Total 68MB)",
        "nucleosHilos": "24 Núcleos (8P + 16E) / 32 Hilos",
        "frecuenciaBase": "3.2 GHz (Thermal Velocity Boost hasta 6.0 GHz)",
        "litografia": "Intel 7 (10nm SuperFin)",
        "graficosIntegrados": "Intel UHD Graphics 770"
    },
    "CPU-RYZEN-7600X": {
        "socket": "AM5",
        "potenciaWatts": "105W TDP",
        "factorForma": "LGA 1718 (AM5)",
        "tipoMemoria": "DDR5 hasta 5200 MT/s",
        "capacidad": "Cache L3: 32MB (Total 38MB)",
        "nucleosHilos": "6 Núcleos / 12 Hilos",
        "frecuenciaBase": "4.7 GHz (Boost hasta 5.3 GHz)",
        "litografia": "TSMC 5nm FinFET",
        "graficosIntegrados": "AMD Radeon Graphics"
    },
    "MB-Z790-DARK-HERO": {
        "socket": "LGA1700",
        "tipoMemoria": "DDR5 (4x DIMM, hasta 192GB, 8000+ MHz OC)",
        "factorForma": "ATX (30.5 cm x 24.4 cm)",
        "potenciaWatts": "Fases de Poder 20+1 (90A)",
        "capacidad": "5x M.2 (1x PCIe 5.0 x4, 4x PCIe 4.0 x4)",
        "conectividad": "Intel Wi-Fi 7, Bluetooth 5.4, 2.5Gb Ethernet",
        "puertosUsb": "2x Thunderbolt 4 Type-C (40Gbps), 6x USB 3.2 Gen 2",
        "audio": "ROG SupremeFX ALC4082 + ESS ES9218 Quad DAC"
    },
    "MB-Z790-FORMULA": {
        "socket": "LGA1700",
        "tipoMemoria": "DDR5 (Hasta 8000+ MHz, 192GB)",
        "factorForma": "ATX Moonlight White",
        "potenciaWatts": "Fases 20+1+2 (105A) con bloque de agua CrossChill EK III",
        "capacidad": "5x Ranuras M.2 NVMe con disipadores térmicos integrados",
        "conectividad": "Intel Wi-Fi 7, Realtek 5Gb Ethernet",
        "pantallaOled": "LiveDash OLED 2 pulgadas integrada para telemetría"
    },
    "MB-B650-A-STRIX-WHITE": {
        "socket": "AM5",
        "tipoMemoria": "DDR5 (4x DIMM, hasta 128GB, 7600+ MHz OC)",
        "factorForma": "ATX (Diseño blanco plateado gaming)",
        "potenciaWatts": "Fases 12+2 (60A)",
        "capacidad": "3x Ranuras M.2 (1x PCIe 5.0, 2x PCIe 4.0)",
        "conectividad": "AMD Wi-Fi 6E, Bluetooth 5.2, Intel 2.5Gb LAN"
    },
    "RAM-DOMINATOR-WHITE-32": {
        "socket": "",
        "tipoMemoria": "DDR5 6600MHz CL32",
        "capacidad": "32GB (2x16GB)",
        "factorForma": "DIMM 288 Pines",
        "potenciaWatts": "Voltaje 1.40V",
        "latencia": "CL32-39-39-76",
        "iluminacion": "11 LEDs RGB Capellix direccionables individualmente",
        "disipador": "Aluminio forjado DHX patentado (Cold-forged)"
    },
    "RAM-DDR5-CORSAIR-32": {
        "socket": "",
        "tipoMemoria": "DDR5 6000MHz CL30",
        "capacidad": "32GB (2x16GB)",
        "factorForma": "DIMM 288 Pines Black",
        "potenciaWatts": "Voltaje 1.35V",
        "perfiles": "Compatible con AMD EXPO e Intel XMP 3.0",
        "iluminacion": "Barra de luz panorámica con 10 zonas RGB dinámicas"
    },
    "SSD-SAMSUNG-990-PRO-2TB": {
        "socket": "",
        "tipoMemoria": "V-NAND TLC Samsung de 176 capas",
        "capacidad": "2TB (2000GB)",
        "factorForma": "M.2 2280 NVMe 2.0 (PCIe Gen 4.0 x4)",
        "potenciaWatts": "5.5W Promedio / 8.5W Ráfaga",
        "lecturaSecuencial": "Hasta 7,450 MB/s",
        "escrituraSecuencial": "Hasta 6,900 MB/s",
        "lecturaAleatoria": "1,400,000 IOPS (4KB, QD32)",
        "durabilidadTbw": "1200 TBW (Terabytes escritos)"
    },
    "SSD-KINGSTON-FURY-2TB": {
        "socket": "",
        "tipoMemoria": "3D TLC NAND",
        "capacidad": "2TB (2048GB)",
        "factorForma": "M.2 2280 con disipador térmico grafeno/aluminio",
        "potenciaWatts": "4.5W Operación",
        "lecturaSecuencial": "Hasta 7,300 MB/s",
        "escrituraSecuencial": "Hasta 7,000 MB/s",
        "durabilidadTbw": "2000 TBW"
    },
    "PSU-ASUS-THOR-1000W": {
        "socket": "",
        "tipoMemoria": "",
        "capacidad": "",
        "potenciaWatts": "1000W Reales Continuos",
        "factorForma": "ATX 100% Full Modular",
        "certificacion": "80 PLUS Platinum (Eficiencia hasta 92%)",
        "pantallaOled": "Panel OLED lateral que muestra consumo de watts en tiempo real",
        "ventilador": "Ventilador Wing-Blade de 135mm con rodamientos dobles y 0dB",
        "garantia": "10 Años de garantía de fabricante"
    },
    "PSU-CORSAIR-RM850X-SHIFT": {
        "socket": "",
        "tipoMemoria": "",
        "capacidad": "",
        "potenciaWatts": "850W Continuos",
        "factorForma": "ATX con puertos modulares de conexión lateral (Patentado)",
        "certificacion": "80 PLUS Gold & Cybenetics Gold",
        "compatibilidadNorma": "ATX 3.0 nativo con cable 12VHPWR PCIe 5.0 incluido",
        "condensadores": "100% Condensadores electrolíticos japoneses a 105°C"
    },
    "CASE-ROG-HYPERION-GR701": {
        "socket": "",
        "tipoMemoria": "",
        "capacidad": "",
        "potenciaWatts": "",
        "factorForma": "Full-Tower (Soporta placas E-ATX, ATX, Micro-ATX, Mini-ITX)",
        "dimensiones": "268 x 639 x 659 mm",
        "materiales": "Estructura de aleación de aluminio fundido, cristal templado dual",
        "soporteRadiadores": "Doble radiador de 420mm simultáneo (Frontal y Superior)",
        "puertosFrontales": "2x USB Type-C 20Gbps (con carga rápida 60W), 4x USB 3.2 Gen 1"
    },
    "CASE-LIANLI-O11D-EVO-RGB": {
        "socket": "",
        "tipoMemoria": "",
        "capacidad": "",
        "potenciaWatts": "",
        "factorForma": "Mid-Tower Panorama (Doble vidrio sin parante frontal)",
        "dimensiones": "478 x 290 x 471 mm",
        "iluminacion": "Tiras ARGB en L integradas en borde superior e inferior",
        "soporteVentiladores": "Hasta 10 ventiladores de 120mm o 3x radiadores de 360mm"
    },
    "CASE-CORSAIR-5000D-AIRFLOW": {
        "socket": "",
        "tipoMemoria": "",
        "capacidad": "",
        "potenciaWatts": "",
        "factorForma": "ATX Mid-Tower High Airflow",
        "dimensiones": "520 x 245 x 520 mm",
        "gestionCables": "Sistema Corsair RapidRoute con 25mm de holgura",
        "soporteRefrigeracion": "Soporta hasta 2 radiadores de 360mm simultáneos"
    },
    "COOLER-ASUS-RYUJIN-III-360": {
        "socket": "Intel LGA 1700 / 1200 / 115X | AMD AM5 / AM4",
        "potenciaWatts": "Radiador de 360mm de aluminio con triple ventilador magnético",
        "pantallaLcd": "Pantalla LCD a todo color de 3.5 pulgadas (60Hz, 32MB almacenamiento)",
        "bomba": "Bomba Asetek Gen8 con motor trifásico de alto caudal",
        "ventiladorVRM": "Ventilador axial integrado en la bomba para enfriar los VRM y SSD",
        "tipoMemoria": "",
        "capacidad": "",
        "factorForma": "Refrigeración Líquida AIO 360mm"
    },
    "COOLER-ROG-STRIX-LC-II-240": {
        "socket": "Intel LGA 1700 / 1200 / 115X | AMD AM5 / AM4",
        "potenciaWatts": "Radiador de 240mm de aluminio",
        "bomba": "Bomba Asetek Gen7 controlada por PWM",
        "ventiladores": "2x Ventiladores ROG 120mm ARGB optimizados para presión estática (81 CFM)",
        "tipoMemoria": "",
        "capacidad": "",
        "factorForma": "Refrigeración Líquida AIO 240mm"
    },
    "COOLER-TUF-LC-II-360": {
        "socket": "Intel LGA 1700 / 1200 / 115X | AMD AM5 / AM4",
        "potenciaWatts": "Radiador de 360mm con aletas de refrigeración ranuradas",
        "durabilidad": "Grado militar TUF Gaming con tubos mallados de 400mm",
        "ventiladores": "3x Ventiladores TUF Gaming 120mm ARGB con certificación IP5X anti-polvo",
        "tipoMemoria": "",
        "capacidad": "",
        "factorForma": "Refrigeración Líquida AIO 360mm"
    }
}

for sku, specs in specs_enrichment.items():
    res = db['productos'].update_one({'codigoSku': sku}, {'$set': {'especificacionesTecnicas': specs}})
    print(f"SKU {sku} actualizado: {res.modified_count}")

print("¡Especificaciones técnicas enriquecidas con éxito!")
