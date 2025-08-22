Write-Host "Starting SkillSync Backend..." -ForegroundColor Green
Write-Host ""

# Set Maven path for this session
$env:MAVEN_HOME = "C:\Users\hp\Downloads\apache-maven-3.9.11"
$env:PATH = "$env:MAVEN_HOME\bin;$env:PATH"

# Check if Maven is available
try {
    $mvnVersion = & mvn --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Maven found:" -ForegroundColor Green
        Write-Host $mvnVersion[0] -ForegroundColor Yellow
    } else {
        throw "Maven not found"
    }
} catch {
    Write-Host "Error: Maven not found. Please check the installation." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Building the project..." -ForegroundColor Green
& mvn clean install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

& mvn spring-boot:run

Write-Host ""
Write-Host "Backend stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit" 