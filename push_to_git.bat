@echo off
title Push RAILNEX to GitHub
color 0A
echo ==============================================================
echo       Push RAILNEX Project to GitHub: rogd2006-del/railnex
echo ==============================================================
echo.

set REPO_URL=https://github.com/rogd2006-del/railnex.git

echo Configuring remote repository...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Pushing local codebase to GitHub (main branch)...
echo Note: If a GitHub login window opens, sign in to authorize the push.
echo.

git push -u origin main --force

echo.
if %ERRORLEVEL% equ 0 (
    echo ==============================================================
    echo [SUCCESS] Code successfully pushed to https://github.com/rogd2006-del/railnex
    echo ==============================================================
) else (
    echo ==============================================================
    echo [NOTE] If login was needed, complete the prompt and run again.
    echo ==============================================================
)

echo.
pause
