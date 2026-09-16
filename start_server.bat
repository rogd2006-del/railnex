@echo off
title RAILNEX - Indian Railways AI Dynamic Block Planner
echo ==============================================================
echo  Launching RAILNEX Web Server on http://localhost:3000/
echo  Smart India Hackathon 2026 (SIH26027) | Team CODELIKE_67
echo ==============================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
