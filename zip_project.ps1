$ErrorActionPreference = 'Stop'

$sourceDir = "c:\Users\marce\OneDrive\Desktop\trabajo_desarrollo"
$destinationZip = "C:\Users\marce\Downloads\PcÑactory_Proyecto_Completo.zip"

Write-Output "Iniciando compresión completa y limpia del proyecto..."

if (Test-Path $destinationZip) {
    Remove-Item $destinationZip -Force
    Write-Output "Archivo anterior eliminado."
}

# Crear carpeta temporal limpia
$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "pcnfactory_clean_" + [System.Guid]::NewGuid().ToString().Substring(0,8))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    # 1. Copiar backend (sin node_modules ni .git)
    $backendDest = Join-Path $tempDir "backend"
    robocopy "$sourceDir\backend" $backendDest /E /XD node_modules .git /NFL /NDL /NJH /NJS | Out-Null

    # 2. Copiar frontend (incluyendo dist para hosting, sin node_modules ni .git)
    $frontendDest = Join-Path $tempDir "frontend"
    robocopy "$sourceDir\frontend" $frontendDest /E /XD node_modules .git /NFL /NDL /NJH /NJS | Out-Null

    # 3. Copiar hosting_fastapi
    $fastapiDest = Join-Path $tempDir "hosting_fastapi"
    if (Test-Path "$sourceDir\hosting_fastapi") {
        robocopy "$sourceDir\hosting_fastapi" $fastapiDest /E /XD __pycache__ .git /NFL /NDL /NJH /NJS | Out-Null
    }

    # 4. Copiar docs
    $docsDest = Join-Path $tempDir "docs"
    if (Test-Path "$sourceDir\docs") {
        robocopy "$sourceDir\docs" $docsDest /E /NFL /NDL /NJH /NJS | Out-Null
    }

    # 5. Copiar archivos raíz (.bat, .exe, scripts, etc.)
    Get-ChildItem -Path $sourceDir -File | ForEach-Object {
        Copy-Item $_.FullName -Destination $tempDir -Force
    }

    # 6. Copiar el documento Word a la raíz del zip para acceso inmediato
    if (Test-Path "$sourceDir\docs\MANUAL_Y_FUNCIONAMIENTO_PCNACTORY.docx") {
        Copy-Item "$sourceDir\docs\MANUAL_Y_FUNCIONAMIENTO_PCNACTORY.docx" -Destination "$tempDir\MANUAL_Y_FUNCIONAMIENTO_PCNACTORY.docx" -Force
    }

    # Comprimir a C:\Users\marce\Downloads
    Compress-Archive -Path "$tempDir\*" -DestinationPath $destinationZip -CompressionLevel Optimal
    
    $zipItem = Get-Item $destinationZip
    $sizeMB = [math]::Round($zipItem.Length / 1MB, 2)
    Write-Output "¡Éxito! Archivo creado en: $($zipItem.FullName) ($sizeMB MB)"
}
finally {
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
