@echo off
call "%~dp0start-site.cmd" build
if errorlevel 1 exit /b %errorlevel%
call "%~dp0start-site.cmd" public
