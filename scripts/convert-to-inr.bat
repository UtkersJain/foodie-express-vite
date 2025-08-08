@echo off
echo 💰 Converting all prices to Indian Rupees (INR)...

REM Database configuration
set DB_NAME=foodie_express
set DB_USER=postgres
set DB_HOST=localhost
set DB_PORT=5432

echo 🔄 Running INR conversion migration...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f scripts/005-convert-to-inr.sql

echo ✅ Price conversion completed successfully!
echo 🇮🇳 All prices are now in Indian Rupees (₹)
echo 📊 Conversion rate used: 1 USD = 82 INR
pause
