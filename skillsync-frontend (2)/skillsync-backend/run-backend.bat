@echo off
echo Starting SkillSync Backend...
echo.

REM Set Maven path
set MAVEN_HOME=C:\Users\hp\Downloads\apache-maven-3.9.11
set PATH=%MAVEN_HOME%\bin;%PATH%

REM Check if Maven is available
mvn --version
if %errorlevel% neq 0 (
    echo Error: Maven not found. Please check the installation.
    pause
    exit /b 1
)

echo.
echo Building the project...
mvn clean install

echo.
echo Starting Spring Boot application...
mvn spring-boot:run

pause 