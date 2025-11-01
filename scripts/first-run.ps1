# First run script for Windows (PowerShell)

Write-Host "Starting project setup..." -ForegroundColor Cyan
Write-Host ""

# Start Docker containers
Write-Host "Starting Docker containers..." -ForegroundColor Yellow
docker compose up -d

# Wait for PostgreSQL to start
Write-Host "Waiting for PostgreSQL to start (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check that containers are running
Write-Host "Checking container status..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$psOutput = docker compose ps 2>&1 | Out-String
if ($psOutput -notmatch "Up|running|healthy") {
    Write-Host "Error: Containers failed to start" -ForegroundColor Red
    Write-Host "Check logs: docker compose logs" -ForegroundColor Yellow
    exit 1
}

Write-Host "Containers are running" -ForegroundColor Green
Write-Host ""

# Run Prisma migrations
Write-Host "Running Prisma migrations..." -ForegroundColor Yellow
docker compose exec app npx prisma migrate dev --name init

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
docker compose exec app npx prisma generate

# Seed database with initial data
Write-Host "Seeding database with initial data..." -ForegroundColor Yellow
docker compose exec app npx tsx prisma/seed.ts

Write-Host ""
Write-Host "Done! Project is set up and running!" -ForegroundColor Green
Write-Host ""
Write-Host "Application available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Admin: admin@example.com / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "View logs: npm run docker:dev:logs" -ForegroundColor Yellow
Write-Host "Stop: npm run docker:dev:stop" -ForegroundColor Yellow
