# scripts/execute-production-deployment.ps1
Write-Host "🚀 EXECUTING PRODUCTION DEPLOYMENT"
Write-Host "=================================="
Write-Host "Timestamp: $(Get-Date)"
Write-Host ""

# Production Configuration
$PRODUCTION_DOMAIN = "caringcompass.com"
$STAGING_DOMAIN = "staging.caringcompass.com"
$DEPLOYMENT_LOG = "deployment-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# Environment variables
$env:NODE_ENV = "production"

try {
    # Verify working directory
    Write-Host "✔ Verifying project root..."
    if (-Not (Test-Path "package.json")) {
        throw "Must be run from project root"
    }

    # Run production build
    Write-Host "⚙ Building production assets..."
    pnpm run build

    # Deploy database migrations
    Write-Host "🗄 Running database migrations..."
    cd packages/database
    pnpm prisma migrate deploy
    cd ../..

    # Deploy the application
    Write-Host "🚀 Deploying to production..."
    pnpm run deploy:production

    Write-Host "✅ Deployment completed successfully!"
    
} catch {
    Write-Host "❌ Deployment failed!"
    Write-Host "Error: $_"
    exit 1
}
