$jsonPath = Join-Path $PSScriptRoot "..\Wada3an_Exercise_Images_Backup_2026-09-09.json"
if (-not (Test-Path $jsonPath)) {
    Write-Error "Backup file not found at $jsonPath"
    exit 1
}

$content = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$data = $content | ConvertFrom-Json
$outputDir = Join-Path $PSScriptRoot "..\assets\exercises"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$extractedMap = @{}
$propNames = $data.psobject.properties.Name
Write-Output "Total entries in backup: $($propNames.Count)"

foreach ($key in $propNames) {
    $entry = $data.$key
    $url = $entry.url
    $visualType = $entry.visualType
    $exName = $entry.exerciseName

    if ($url -match '^data:image\/([a-zA-Z0-9\+\-]+);base64,(.+)$') {
        $ext = $matches[1]
        if ($ext -eq 'jpeg') { $ext = 'jpg' }
        $base64Data = $matches[2]
        
        # Build safe filename
        $safeName = $key -replace '[^a-zA-Z0-9_\-]', '_'
        $fileName = "custom_$safeName.$ext"
        $filePath = Join-Path $outputDir $fileName

        $bytes = [System.Convert]::FromBase64String($base64Data)
        [System.IO.File]::WriteAllBytes($filePath, $bytes)

        $extractedMap[$key] = @{
            file = "assets/exercises/$fileName"
            visualType = $visualType
            name = $exName
            size = $bytes.Length
        }
        Write-Output "Extracted: $key -> assets/exercises/$fileName ($([math]::Round($bytes.Length/1KB, 1)) KB)"
    } else {
        Write-Output "Skipped $key - not a data URL: $($url.Substring(0, [math]::Min(30, $url.Length)))"
    }
}

Write-Output "`nSummary: Extracted $($extractedMap.Count) images successfully to assets/exercises/."
$summaryJson = $extractedMap | ConvertTo-Json -Depth 3
$summaryPath = Join-Path $PSScriptRoot "extracted_summary.json"
Set-Content -Path $summaryPath -Value $summaryJson -Encoding UTF8
