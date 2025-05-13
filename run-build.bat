@echo off
echo Running build...
npm run build
if %errorlevel% neq 0 (
  echo Build failed.
  exit /b %errorlevel%
)
echo Build completed successfully.
echo Upload the "dist/public" folder to Netlify as the publish directory.
pause
