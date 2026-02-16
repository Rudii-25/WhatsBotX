@echo off
REM Quick build script for WhatsBotX on Windows
REM Note: Can only build for the current platform (Windows on Windows, macOS on macOS, Linux on Linux)
REM Usage: build.bat [win|mac|linux|help]

setlocal enabledelayedexpansion

if "%1"=="" (
  echo WhatsBotX Build Script for Windows
  echo ==================================
  echo.
  echo Usage: build.bat [target]
  echo.
  echo Targets:
  echo   win      - Build Windows installer and portable .exe ^(RECOMMENDED on Windows^)
  echo   help     - Show this help message
  echo.
  echo NOTE: Platform-specific builds require the correct OS:
  echo   - Windows installer ^(win^): Run on Windows machine
  echo   - macOS app ^(.dmg^): Run on macOS machine
  echo   - Linux app ^(.AppImage^): Run on Linux machine
  echo.
  echo For cross-platform builds, use GitHub Actions or run on each platform.
  echo.
  echo Examples:
  echo   build.bat win       ^(builds Windows installer^)
  echo   build.bat help      ^(shows this message^)
  echo.
  exit /b 1
)

if "%1"=="help" (
  call :show_help
  exit /b 0
)

echo WhatsBotX Build Tool ^(Windows^)
echo =============================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  echo.
)

REM Run the build command for the specified platform
if "%1"=="win" (
  echo Building Windows installer and portable executable...
  echo.
  call npm run build-win
  if !errorlevel! equ 0 (
    echo.
    echo ✅ Windows build completed successfully!
    echo.
    echo Output location: .\dist\
    echo.
    echo Installers created:
    echo   - WhatsBotX Setup 2.0.0.exe ^(NSIS installer - recommended^)
    echo   - WhatsBotX 2.0.0.exe ^(Portable executable^)
    echo.
  ) else (
    echo.
    echo ❌ Build failed!
    exit /b 1
  )
) else if "%1"=="mac" (
  echo Error: macOS builds can only be created on macOS machines.
  echo.
  echo To build for macOS, run on a Mac:
  echo   ./build.sh mac
  exit /b 1
) else if "%1"=="linux" (
  echo Error: Linux builds can only be created on Linux machines.
  echo.
  echo To build for Linux, run on a Linux machine:
  echo   ./build.sh linux
  exit /b 1
) else (
  echo Unknown target: %1
  echo Run: build.bat help
  exit /b 1
)

:show_help
echo WhatsBotX Build Script - Help
echo =============================
echo.
echo Platform-specific builds require running on the target OS.
echo.
echo On Windows machine:
echo   build.bat win          ^(Creates .exe installer^)
echo.
echo On macOS machine:
echo   ./build.sh mac         ^(Creates .dmg installer^)
echo.
echo On Linux machine:
echo   ./build.sh linux       ^(Creates .AppImage installer^)
echo.
echo For cross-platform distribution:
echo   1. Use GitHub Actions CI/CD workflow
echo   2. Or run build commands on each platform manually
echo.
exit /b 0

