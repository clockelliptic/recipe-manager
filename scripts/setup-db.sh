#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting database setup..."

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker daemon is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is installed (newer docker installations use 'docker compose')
DOCKER_COMPOSE="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    else
        echo "❌ Error: docker-compose or 'docker compose' is not installed."
        exit 1
    fi
fi

# Start the database
echo "🐘 Starting PostgreSQL container..."
$DOCKER_COMPOSE up -d

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec test-db pg_isready -U postgres &> /dev/null; do
  echo "Still waiting for PostgreSQL..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📄 Creating .env from .env.example..."
    cp .env.example .env
fi

# Push schema and seed
echo "🔄 Pushing database schema..."
npx prisma db push

echo "🌱 Seeding database..."
npx prisma db seed

echo "✨ Database setup complete!"
