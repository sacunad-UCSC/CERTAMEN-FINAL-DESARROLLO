from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['pc_nfactory_db']

specs_extra = {
    "MB-MAXIMUS-Z790-FORMULA": {
        "socket": "LGA1700",
        "tipoMemoria": "DDR5 (Hasta 8000+ MHz, 192GB)",
        "factorForma": "ATX Moonlight White",
        "potenciaWatts": "Fases 20+1+2 (105A) con bloque de agua CrossChill EK III",
        "capacidad": "5x Ranuras M.2 NVMe con disipadores térmicos integrados",
        "conectividad": "Intel Wi-Fi 7, Realtek 5Gb Ethernet",
        "pantallaOled": "LiveDash OLED 2 pulgadas integrada para telemetría"
    },
    "MB-B650A-ROG": {
        "socket": "AM5",
        "tipoMemoria": "DDR5 (4x DIMM, hasta 128GB, 7600+ MHz OC)",
        "factorForma": "ATX (Diseño blanco plateado gaming)",
        "potenciaWatts": "Fases 12+2 (60A)",
        "capacidad": "3x Ranuras M.2 (1x PCIe 5.0, 2x PCIe 4.0)",
        "conectividad": "AMD Wi-Fi 6E, Bluetooth 5.2, Intel 2.5Gb LAN"
    },
    "RAM-CORSAIR-TITANIUM-32": {
        "socket": "",
        "tipoMemoria": "DDR5 6600MHz CL32",
        "capacidad": "32GB (2x16GB)",
        "factorForma": "DIMM 288 Pines White",
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
        "latencia": "CL30-36-36-76",
        "perfiles": "Compatible con AMD EXPO e Intel XMP 3.0",
        "iluminacion": "Barra de luz panorámica con 10 zonas RGB dinámicas"
    },
    "SSD-SAMSUNG-990PRO-2TB": {
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
    "PSU-ROG-THOR-1000P2": {
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

for sku, specs in specs_extra.items():
    res = db['productos'].update_one({'codigoSku': sku}, {'$set': {'especificacionesTecnicas': specs}})
    print(f"SKU {sku} actualizado: {res.modified_count}")

print("¡Todos los productos ahora cuentan con especificaciones completas!")
