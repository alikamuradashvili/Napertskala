@echo off
setlocal
where node.exe >nul 2>nul
if not errorlevel 1 (
  node "%~dp0site\scripts\setup-google.mjs" "%~1"
  exit /b
)
set "NAPERTSKALA_NODE=C:\Users\alika\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NAPERTSKALA_NODE%" (
  echo ERROR: Install Node.js 22 or newer before setting up Google sign-in.
  exit /b 1
)
"%NAPERTSKALA_NODE%" "%~dp0site\scripts\setup-google.mjs" "%~1"
exit /b %errorlevel%
