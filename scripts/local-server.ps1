param(
    [int]$Port = 8080,
    [string]$Root = "C:\Users\jamaljk\Desktop\Smart Check Pro1"
)

$logFile = "C:\Users\jamaljk\.gemini\antigravity\brain\f0836db8-479f-4d4e-b5cc-db350425ea8f\scratch\server_debug.log"
"Starting server at $(Get-Date)" | Out-File $logFile

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    $listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Any, $Port)
    $listener.Start()
    "Listener started on port $Port" | Out-File $logFile -Append
    Write-Host "Server started"

    while ($true) {
        $client = $listener.AcceptTcpClient()
        "Client accepted" | Out-File $logFile -Append
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII)
            $requestLine = $reader.ReadLine()
            "Request: $requestLine" | Out-File $logFile -Append

            if (-not [string]::IsNullOrWhiteSpace($requestLine)) {
                $parts = $requestLine.Split(' ')
                $rawPath = $parts[1].Split('?')[0]
                $rawPath = [System.Uri]::UnescapeDataString($rawPath)
                if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }

                $localPath = [System.IO.Path]::Combine($Root, $rawPath.TrimStart('/').Replace('/', '\'))
                "Looking for file: $localPath" | Out-File $logFile -Append

                if ([System.IO.File]::Exists($localPath)) {
                    $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                    $ct = $mimeTypes[$ext]
                    if (-not $ct) { $ct = "application/octet-stream" }
                    $bytes = [System.IO.File]::ReadAllBytes($localPath)

                    $hdr = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
                    $stream.Write($hdrBytes, 0, $hdrBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                    $stream.Flush()
                    "Served 200 OK: $localPath ($($bytes.Length) bytes)" | Out-File $logFile -Append
                } else {
                    $body = "<h1>404 Not Found</h1>"
                    $bBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
                    $hdr = "HTTP/1.1 404 Not Found`r`nContent-Type: text/html`r`nContent-Length: $($bBytes.Length)`r`nConnection: close`r`n`r`n"
                    $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
                    $stream.Write($hdrBytes, 0, $hdrBytes.Length)
                    $stream.Write($bBytes, 0, $bBytes.Length)
                    $stream.Flush()
                    "404 Not Found: $localPath" | Out-File $logFile -Append
                }
            }
        } catch {
            "Client handling error: $($_.Exception.Message)" | Out-File $logFile -Append
        } finally {
            $client.Close()
        }
    }
} catch {
    "Server main loop exception: $($_.Exception.Message)" | Out-File $logFile -Append
} finally {
    if ($listener) { $listener.Stop() }
}
