@echo off
setlocal
title Napertskala Website Watchdog

:run
echo.
echo [%date% %time%] Starting the Napertskala website...
call "%~dp0start-site.cmd" public
set "SITE_EXIT=%errorlevel%"
echo [%date% %time%] Website stopped with exit code %SITE_EXIT%.
echo Restarting automatically in 5 seconds. Close this window to stop it.
timeout /t 5 /nobreak >nul
goto run
