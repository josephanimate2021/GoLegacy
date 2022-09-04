:: GoLegacy Updater
:: License: MIT
title GoLegacy Updater [Initializing...]

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
if not exist utilities ( goto error_location )
if not exist wrapper ( goto error_location )
if not exist server ( goto error_location )
goto noerror_location
:error_location
echo Doesn't seem like this script is in a GoLegacy folder.
pause && exit
:noerror_location

:::::::::::::::::::::::::
:: Post-Initialization ::
:::::::::::::::::::::::::

title GoLegacy Updater

if not exist .git ( goto nogit )
:yesgit
echo GoLegacy Updater
echo A project from VisualPlugin adapted by Rage and the GoLegacy Team
echo:
echo Enter 1 to update GoLegacy
echo Enter 0 to close the updater
goto wrapperidle
:nogit
echo You have not downloaded GoLegacy using the installer... somehow??
echo Please download the installer and run it https://wrapper-offline.ga/installer/installer_windows.exe.
pause & exit
:wrapperidle
echo:

:::::::::::::
:: Choices ::
:::::::::::::

set /p CHOICE=Choice:
if "!choice!"=="0" goto exit
if "!choice!"=="1" goto update
echo Time to choose. && goto wrapperidle

:update
cls
pushd "%~dp0"
echo Pulling repository from GitHub...
git pull
cls
echo GoLegacy has been updated^^!
start "" "%~dp0"
pause & exit

:exit
pause & exit