Add-Type -AssemblyName System.Drawing

$brandDir = Join-Path $PSScriptRoot "..\public\images\brand"
$source = Join-Path $brandDir "helping-hands-logo.png"

function Test-IsNearBlack([int]$r, [int]$g, [int]$b) {
    return ($r -lt 28 -and $g -lt 28 -and $b -lt 28)
}

function Test-IsDarkBrandBlue([int]$r, [int]$g, [int]$b) {
    $avg = ($r + $g + $b) / 3
    return ($avg -lt 85 -and $b -lt 115 -and $b -ge ($r + 5))
}

function New-TransparentBitmap([System.Drawing.Bitmap]$source, [bool]$whiteText = $false) {
    $result = New-Object System.Drawing.Bitmap $source.Width, $source.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $source.Height; $y++) {
        for ($x = 0; $x -lt $source.Width; $x++) {
            $pixel = $source.GetPixel($x, $y)
            $r = [int]$pixel.R
            $g = [int]$pixel.G
            $b = [int]$pixel.B

            if (Test-IsNearBlack $r $g $b) {
                $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                continue
            }

            if ($whiteText -and (Test-IsDarkBrandBlue $r $g $b)) {
                $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
                continue
            }

            $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
        }
    }
    return $result
}

function Save-Png([System.Drawing.Bitmap]$bitmap, [string]$path) {
    $temp = "$path.tmp"
    if (Test-Path $temp) { Remove-Item $temp -Force }
    $bitmap.Save($temp, [System.Drawing.Imaging.ImageFormat]::Png)
    if (Test-Path $path) { Remove-Item $path -Force }
    Move-Item $temp $path
}

function Resize-Bitmap([System.Drawing.Bitmap]$bitmap, [int]$width) {
    $height = [int][Math]::Round($bitmap.Height * ($width / $bitmap.Width))
    $resized = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($resized)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($bitmap, 0, 0, $width, $height)
    $graphics.Dispose()
    return $resized
}

function New-MarkBitmap([System.Drawing.Bitmap]$source) {
    $markWidth = [int][Math]::Round($source.Height * 1.02)
    $mark = New-Object System.Drawing.Bitmap $markWidth, $source.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($y = 0; $y -lt $source.Height; $y++) {
        for ($x = 0; $x -lt $markWidth; $x++) {
            $pixel = $source.GetPixel($x, $y)
            $r = [int]$pixel.R
            $g = [int]$pixel.G
            $b = [int]$pixel.B

            if (Test-IsNearBlack $r $g $b) {
                $mark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
            else {
                $mark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }
    return $mark
}

$original = [System.Drawing.Bitmap]::FromFile($source)
try {
$transparent = New-TransparentBitmap $original $false
$white = New-TransparentBitmap $original $true
$mark = New-MarkBitmap $transparent
$markWhite = New-TransparentBitmap $mark $true

Save-Png $transparent (Join-Path $brandDir "helping-hands-logo.png")
Save-Png $white (Join-Path $brandDir "helping-hands-logo-white.png")
Save-Png $mark (Join-Path $brandDir "helping-hands-mark.png")
Save-Png $markWhite (Join-Path $brandDir "helping-hands-mark-white.png")

foreach ($width in @(320, 480, 640)) {
    $resized = Resize-Bitmap $transparent $width
    Save-Png $resized (Join-Path $brandDir "helping-hands-logo-$width.png")
    $resized.Dispose()
}

$faviconSize = 64
$favicon = Resize-Bitmap $mark $faviconSize
Save-Png $favicon (Join-Path $brandDir "favicon.png")
Copy-Item (Join-Path $brandDir "favicon.png") (Join-Path $PSScriptRoot "..\src\app\icon.png") -Force

$original.Dispose()
$transparent.Dispose()
$white.Dispose()
$mark.Dispose()
$markWhite.Dispose()
$favicon.Dispose()
}
finally {
    if ($original) { $original.Dispose() }
}

Write-Host "Brand assets generated in $brandDir"
