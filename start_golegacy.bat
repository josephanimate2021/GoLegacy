:: GoLegacy Launcher
:: License: MIT
set WRAPPER_VER=0.0.1.2
title GoLegacy v%WRAPPER_VER% [Initializing...]

::::::::::::::::::::
:: Initialization ::
::::::::::::::::::::

:: Stop commands from spamming stuff, cleans up the screen
@echo off && cls

:: Lets variables work or something idk im not a nerd
SETLOCAL ENABLEDELAYEDEXPANSION

:: Make sure we're starting in the correct folder, and that it worked (otherwise things would go horribly wrong)
pushd "%~dp0"
if !errorlevel! NEQ 0 goto error_location
if not exist wrapper ( goto error_location )
if not exist server ( goto error_location )
goto noerror_location
:error_location
echo Doesn't seem like this script is in a GoLegacy folder.
pause && exit
:noerror_location

:: patch detection
if exist "patch.jpg" goto patched

:: Check *again* because it seems like sometimes it doesn't go into dp0 the first time???
pushd "%~dp0"
if !errorlevel! NEQ 0 goto error_location
if not exist wrapper ( goto error_location )
if not exist server ( goto error_location )

:: Welcome, Director Ford!
echo GoLegacy
echo A project from VisualPlugin adapted by Rage and the GoLegacy team
echo Version !WRAPPER_VER!
echo:

:::::::::::::::::::::::
:: Starting GoLegacy ::
:::::::::::::::::::::::

title GoLegacy v!WRAPPER_VER! [Loading...]

:: Close existing node apps
:: Hopefully fixes EADDRINUSE errors??
TASKKILL /IM node.exe /F 2>nul

:: Start Node.js
echo Loading Node.js...
cd wrapper
if not exist node_modules (
        echo Error: Node.js could not be loaded! Trying again with the npm install command...
        npm install
        echo Loading Node.js Again...
        npm start
        pause
) else (
        npm start
        pause
)
