#!/bin/bash

# Script to convert all prices from USD to Indian Rupees
echo "💰 Converting all prices to Indian Rupees (INR)..."

# Database configuration
DB_NAME="foodie_express"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "🔄 Running INR conversion migration..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/005-convert-to-inr.sql

echo "✅ Price conversion completed successfully!"
echo "🇮🇳 All prices are now in Indian Rupees (₹)"
echo "📊 Conversion rate used: 1 USD = 82 INR"
