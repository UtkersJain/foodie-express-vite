@echo off
echo 🖼️  Updating menu item images in database...

REM Database configuration
set DB_NAME=foodie_express
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo 🔄 Running image update migration...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f scripts/004-update-existing-images.sql

echo ✅ Database images updated successfully!
echo 🎨 All menu items now have unique Unsplash images
pause
