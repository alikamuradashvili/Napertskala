@echo off
setlocal
title Napertskala Cloudflare Tunnel Watchdog

set "CLOUDFLARED=C:\Program Files (x86)\cloudflared\cloudflared.exe"
set "TUNNEL_CONFIG=%~dp0cloudflared-config.yml"
set "DNS_RESOLVER_PRIMARY=1.1.1.1:53"
set "DNS_RESOLVER_SECONDARY=1.0.0.1:53"

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
"%CLOUDFLARED%" tunnel --config "%TUNNEL_CONFIG%" run --dns-resolver-addrs "%DNS_RESOLVER_PRIMARY%" --dns-resolver-addrs "%DNS_RESOLVER_SECONDARY%" napertskala
set "TUNNEL_EXIT=%errorlevel%"
echo [%date% %time%] Tunnel stopped with exit code %TUNNEL_EXIT%.
echo Restarting automatically in 5 seconds. Close this window to stop it.
timeout /t 5 /nobreak >nul
goto run
