$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "HTTP Server listening on http://localhost:8080/"
$listener.Stop()
Write-Host "Stopped"
