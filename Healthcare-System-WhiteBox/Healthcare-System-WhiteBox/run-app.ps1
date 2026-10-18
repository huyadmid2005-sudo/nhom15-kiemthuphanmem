$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (Test-Path out) { Remove-Item -Recurse -Force out }
New-Item -ItemType Directory -Path out | Out-Null

$src = Get-ChildItem -Recurse "src\main\java\*.java" | ForEach-Object { $_.FullName }
javac -encoding UTF-8 -d out $src
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Open http://localhost:8088" -ForegroundColor Green
java -cp out vn.edu.it6013.healthcare.Application
