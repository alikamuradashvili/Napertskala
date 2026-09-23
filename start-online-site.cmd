@echo off
setlocal
title Napertskala Online Launcher

set "CLOUDFLARED=C:\Program Files (x86)\cloudflared\cloudflared.exe"
set "TUNNEL_CONFIG=%~dp0cloudflared-config.yml"

if not exist "%CLOUDFLARED%" (
  echo ERROR: cloudflared was not found.
  echo Install Cloudflare Tunnel and run this file again.
  pause
  exit /b 1
)

if not exist "%TUNNEL_CONFIG%" (
  echo ERROR: Cloudflare Tunnel configuration is missing.
  pause
  exit /b 1
)

echo Checking the local website...
powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 3; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
if errorlevel 1 (
  echo Starting the website watchdog...
  start "Napertskala Website Watchdog" cmd.exe /k ""%~dp0run-site-server.cmd""
) else (
  echo Website is already running.
)

echo Waiting for http://localhost:3000 ...
set /a SITE_WAIT=0
:wait_for_site
powershell.exe -NoProfile -Command "try { $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 3; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
if not errorlevel 1 goto site_ready
set /a SITE_WAIT+=2
if %SITE_WAIT% GEQ 90 goto site_timeout
timeout /t 2 /nobreak >nul
goto wait_for_site

:site_ready
echo Website is ready. Starting the tunnel watchdog...
"%CLOUDFLARED%" tunnel info napertskala 2>nul | findstr /C:"CONNECTOR ID" >nul
if errorlevel 1 (
  start "Napertskala Tunnel Watchdog" cmd.exe /k ""%~dp0run-cloudflare-tunnel.cmd""
) else (
  echo Cloudflare Tunnel is already connected.
)

echo Waiting for the public tunnel connection...
set /a TUNNEL_WAIT=0
:wait_for_tunnel
"%CLOUDFLARED%" tunnel info napertskala 2>nul | findstr /C:"CONNECTOR ID" >nul
if not errorlevel 1 goto online
set /a TUNNEL_WAIT+=2
if %TUNNEL_WAIT% GEQ 60 goto tunnel_timeout
timeout /t 2 /nobreak >nul
goto wait_for_tunnel

:online
echo.
echo Napertskala is ONLINE.
echo Public URL: https://napertskala.ge
echo Local URL:  http://localhost:3000
echo.
echo Keep both watchdog CMD windows open.
echo This launcher window may now be closed.
pause
exit /b 0

:site_timeout
echo ERROR: The website did not become ready within 90 seconds.
echo Check the Napertskala Website Watchdog window.
pause
exit /b 1

:tunnel_timeout
echo ERROR: Cloudflare Tunnel did not connect within 60 seconds.
echo Check the Napertskala Tunnel Watchdog window and your internet connection.
pause
exit /b 1
