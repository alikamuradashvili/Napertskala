@echo off
setlocal
title Napertskala Cloudflare Tunnel Watchdog

set "CLOUDFLARED=C:\Program Files (x86)\cloudflared\cloudflared.exe"
set "TUNNEL_CONFIG=%~dp0cloudflared-config.yml"

if not exist "%CLOUDFLARED%" (
  echo ERROR: cloudflared was not found.
  pause
  exit /b 1
)

if not exist "%TUNNEL_CONFIG%" (
  echo ERROR: Cloudflare Tunnel configuration is missing.
  pause
  exit /b 1
)

:run
echo.
echo [%date% %time%] Starting the Napertskala Cloudflare Tunnel...
"%CLOUDFLARED%" tunnel --config "%TUNNEL_CONFIG%" run napertskala
set "TUNNEL_EXIT=%errorlevel%"
echo [%date% %time%] Tunnel stopped with exit code %TUNNEL_EXIT%.
echo Restarting automatically in 5 seconds. Close this window to stop it.
timeout /t 5 /nobreak >nul
goto run
