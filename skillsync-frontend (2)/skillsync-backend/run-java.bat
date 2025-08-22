@echo off
echo Starting SkillSync Backend with Java...
echo.

REM Set Java and Maven paths
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.5.11-hotspot
set MAVEN_HOME=C:\Users\hp\Downloads\apache-maven-3.9.11
set PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%

echo Java version:
java -version

echo.
echo Maven version:
mvn --version

echo.
echo Building project...
mvn clean compile

echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo.
mvn spring-boot:run

pause 