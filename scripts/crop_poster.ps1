Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\jamaljk\.gemini\antigravity\brain\f0836db8-479f-4d4e-b5cc-db350425ea8f\.user_uploaded\media_1788266053653.png'
$outDir = 'assets\exercises'

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source image: $($bmp.Width) x $($bmp.Height)"

# In 1024x640:
# Poster bounds:
$posterX = 306
$posterY = 66
$posterW = 412
$posterH = 530

# Exercise grid is inside the poster (below the header "SCIATICA PAIN RELIEF EXERCISES")
$gridX = $posterX + 10
$gridY = $posterY + 62
$gridW = $posterW - 20
$gridH = $posterH - 95

$cellW = [int]($gridW / 4)
$cellH = [int]($gridH / 4)

$cellNames = @(
    "pelvic_tilt", "knee_to_chest", "spinal_twist", "cat_cow_poster",
    "cobra_stretch", "seated_piriformis", "pigeon_pose", "glute_bridge",
    "clamshell", "slump_floss", "sciatic_glide", "hamstring_stretch",
    "child_pose_poster", "hip_flexor", "bird_dog", "figure4_poster"
)

for ($row = 0; $row -lt 4; $row++) {
    for ($col = 0; $col -lt 4; $col++) {
        $idx = ($row * 4) + $col
        $name = $cellNames[$idx]

        $cropX = $gridX + ($col * $cellW)
        $cropY = $gridY + ($row * $cellH)
        $w = $cellW
        $h = $cellH

        if ($cropX + $w -gt $bmp.Width) { $w = $bmp.Width - $cropX }
        if ($cropY + $h -gt $bmp.Height) { $h = $bmp.Height - $cropY }

        if ($w -gt 0 -and $h -gt 0) {
            $rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $w, $h)
            $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
            $outFile = Join-Path $outDir "$name.png"
            $cropped.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
            $cropped.Dispose()
            Write-Host "Cropped: $name -> $outFile ($w x $h)"
        }
    }
}

$bmp.Dispose()
Write-Host "All 16 exercise graphics extracted perfectly!"
