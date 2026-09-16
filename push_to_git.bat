@echo off
title Push RAILNEX to Git Repository
echo ==============================================================
echo       Push RAILNEX Project to Git / GitHub Repository
echo ==============================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git command was not found in your system PATH.
    echo Please install Git for Windows from https://git-scm.com/download/win
    echo or ensure Git is added to your environment PATH.
    echo.
    pause
    exit /b 1
)

set /p REPO_URL="Enter your remote Git repository URL (e.g. https://github.com/username/railnex.git): "
if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL provided. Exiting.
    pause
    exit /b 1
)

echo.
echo Initializing Git repository...
git init

echo Staging files (excluding sensitive keys via .gitignore)...
git add .

echo Creating initial commit...
git commit -m "Initial commit: RAILNEX Indian Railways AI Block Planning platform"

echo Setting default branch to main...
git branch -M main

echo Configuring remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Pushing to %REPO_URL%...
git push -u origin main

echo.
echo ==============================================================
echo Push process completed. Check the output above.
echo ==============================================================
pause
