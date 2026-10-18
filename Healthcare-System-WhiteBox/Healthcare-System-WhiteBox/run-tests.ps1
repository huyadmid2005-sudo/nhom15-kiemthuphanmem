$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (Test-Path out-test) { Remove-Item -Recurse -Force out-test }
New-Item -ItemType Directory -Path out-test | Out-Null

$main = Get-ChildItem -Recurse "src\main\java\*.java" | ForEach-Object { $_.FullName }
$tests = Get-ChildItem -Recurse "src\test\java\*.java" | ForEach-Object { $_.FullName }

javac -encoding UTF-8 -d out-test $main $tests
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

java -cp out-test vn.edu.it6013.healthcare.WhiteBoxTestRunner
