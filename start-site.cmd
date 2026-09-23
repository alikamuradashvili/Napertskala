@echo off
setlocal
title Napertskala Website

set "PROJECT_DIR=%~dp0site"
set "CODEX_NODE=C:\Users\alika\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "CODEX_TOOLS=C:\Users\alika\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback"

where node.exe >nul 2>nul
if errorlevel 1 (
  if not exist "%CODEX_NODE%\node.exe" (
    echo ERROR: Node.js was not found.
    echo Install Node.js 22 or newer, then reopen Command Prompt.
    pause
    exit /b 1
  )
  set "PATH=%CODEX_NODE%;%CODEX_TOOLS%;%PATH%"
)

where pnpm.cmd >nul 2>nul
if errorlevel 1 (
  if not exist "%CODEX_TOOLS%\pnpm.cmd" (
    echo ERROR: pnpm was not found.
    echo Install pnpm, then reopen Command Prompt.
    pause
    exit /b 1
  )
  set "PATH=%CODEX_TOOLS%;%PATH%"
)

if not exist "%PROJECT_DIR%\package.json" (
  echo ERROR: The site folder or package.json is missing.
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%"
set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=dev"

if /i "%COMMAND%"=="install" goto install
if /i "%COMMAND%"=="build" goto build
if /i "%COMMAND%"=="check" goto check
if /i "%COMMAND%"=="restart" goto restart
if /i "%COMMAND%"=="public" goto public
if /i "%COMMAND%"=="stop" goto stop
if /i "%COMMAND%"=="dev" goto dev

echo Unknown command: %COMMAND%
echo.
echo Available commands:
echo   start-site.cmd
echo   start-site.cmd install
echo   start-site.cmd build
echo   start-site.cmd check
echo   start-site.cmd restart
echo   start-site.cmd public
echo   start-site.cmd stop
exit /b 1

:install
echo Installing Napertskala dependencies...
call pnpm.cmd install
exit /b %errorlevel%

:build
echo Building Napertskala for production...
call pnpm.cmd run build
exit /b %errorlevel%

:check
echo Checking TypeScript...
node "%PROJECT_DIR%\node_modules\typescript\bin\tsc" --noEmit
exit /b %errorlevel%

:dev
call :find_running_server
if defined SERVER_PID (
  echo Napertskala is already running.
  echo URL: %SERVER_URL%
  echo PID: %SERVER_PID%
  echo.
  echo Use "start-site.cmd restart" if you want a fresh server.
  exit /b 0
)
if not exist "node_modules" (
  echo Dependencies are missing. Installing them first...
  call pnpm.cmd install
  if errorlevel 1 exit /b %errorlevel%
)
echo Starting Napertskala website...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop the server.
echo.
call pnpm.cmd run dev
exit /b %errorlevel%

:public
call :find_running_server
if defined SERVER_PID (
  echo Stopping the existing Napertskala server with PID %SERVER_PID%...
  taskkill /PID %SERVER_PID% /F >nul 2>nul
  timeout /t 2 /nobreak >nul
  if exist ".vinext\dev\lock.json" del /q ".vinext\dev\lock.json"
)
if not defined SERVER_PID if exist ".vinext\dev\lock.json" del /q ".vinext\dev\lock.json"
if not exist "node_modules" (
  echo Dependencies are missing. Installing them first...
  call pnpm.cmd install
  if errorlevel 1 exit /b %errorlevel%
)
echo Starting Napertskala for local and Cloudflare Tunnel access...
echo Local URL: http://localhost:3000
echo Keep this Command Prompt window open. Press Ctrl+C to stop.
echo.
call pnpm.cmd exec vinext dev --hostname 0.0.0.0 --port 3000
exit /b %errorlevel%

:restart
call :find_running_server
if defined SERVER_PID (
  echo Stopping the existing Napertskala server with PID %SERVER_PID%...
  taskkill /PID %SERVER_PID% /F >nul 2>nul
  timeout /t 2 /nobreak >nul
  if exist ".vinext\dev\lock.json" del /q ".vinext\dev\lock.json"
)
set "COMMAND=dev"
goto dev

:stop
call :find_running_server
if not defined SERVER_PID (
  echo Napertskala is not currently running.
  exit /b 0
)
echo Stopping Napertskala server with PID %SERVER_PID%...
taskkill /PID %SERVER_PID% /F >nul 2>nul
timeout /t 2 /nobreak >nul
if exist ".vinext\dev\lock.json" del /q ".vinext\dev\lock.json"
echo Napertskala server stopped.
exit /b 0

:find_running_server
set "SERVER_PID="
set "SERVER_URL="
if not exist ".vinext\dev\lock.json" exit /b 0
for /f "tokens=1,2 delims=|" %%A in ('powershell.exe -NoProfile -Command "$lock = Get-Content -Raw '.vinext\dev\lock.json' | ConvertFrom-Json; if (Get-Process -Id $lock.pid -ErrorAction SilentlyContinue) { Write-Output ($lock.pid.ToString() + '|' + $lock.appUrl) }"') do (
  set "SERVER_PID=%%A"
  set "SERVER_URL=%%B"
)
exit /b 0
