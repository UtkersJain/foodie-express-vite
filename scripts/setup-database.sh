#!/bin/bash

# Setup script for PostgreSQL database with dummy data
echo "🚀 Setting up FoodieExpress Database..."

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first."
    echo "   - Windows: Download from https://www.postgresql.org/download/windows/"
    echo "   - macOS: brew install postgresql"
    echo "   - Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Database configuration
DB_NAME="foodie_express"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "📊 Creating database: $DB_NAME"

# Create database (will prompt for password)
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database might already exist"

echo "🏗️  Running schema migration..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/001-initial-schema.sql

echo "🌱 Seeding dummy data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/002-seed-data.sql

echo "✅ Database setup complete!"
echo "🔗 Connection string: postgresql://$DB_USER:password@$DB_HOST:$DB_PORT/$DB_NAME"
