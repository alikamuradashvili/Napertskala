@echo off
setlocal
title Napertskala Website Watchdog

:build
echo.
echo [%date% %time%] Building the Napertskala production website...
call "%~dp0start-site.cmd" build
if not errorlevel 1 goto run
echo [%date% %time%] Production build failed.
echo Retrying automatically in 10 seconds. Close this window to stop it.
timeout /t 10 /nobreak >nul
goto build

:run
echo.
echo [%date% %time%] Starting the Napertskala production website...
call "%~dp0start-site.cmd" public
set "SITE_EXIT=%errorlevel%"
echo [%date% %time%] Website stopped with exit code %SITE_EXIT%.
echo Restarting automatically in 5 seconds. Close this window to stop it.
timeout /t 5 /nobreak >nul
goto run
