@echo off
echo 🚀 Setting up PostgreSQL for FoodieExpress on Windows...

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo Make sure to add PostgreSQL bin directory to your PATH
    pause
    exit /b 1
)

echo ✅ PostgreSQL found

REM Set database variables
set DB_NAME=foodie_express
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo 📊 Creating database: %DB_NAME%

REM Create database
createdb -h %DB_HOST% -p %DB_PORT% -U %DB_USER% %DB_NAME% 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Database might already exist, continuing...
)

echo 🏗️  Running schema migration...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f scripts/001-initial-schema.sql

echo 🌱 Seeding dummy data...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f scripts/002-seed-data.sql

echo 📈 Adding additional sample data...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f scripts/003-additional-sample-data.sql

echo ✅ Database setup complete!
echo 🔗 Connection string: postgresql://%DB_USER%:password@%DB_HOST%:%DB_PORT%/%DB_NAME%
echo.
echo 🚀 You can now start the server with: npm run dev
pause
