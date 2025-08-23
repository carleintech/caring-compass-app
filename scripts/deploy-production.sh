# scripts/deploy-production.sh
#!/bin/bash

echo "🚀 Caring Compass Production Deployment"
echo "======================================="

# Set deployment variables
ENVIRONMENT="production"
DOMAIN="caringcompass.com"
STAGING_DOMAIN="staging.caringcompass.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking deployment prerequisites..."
    
    # Check if required CLI tools are installed
    command -v vercel >/dev/null 2>&1 || { log_error "Vercel CLI is required but not installed. Run: npm i -g vercel"; exit 1; }
    command -v supabase >/dev/null 2>&1 || { log_error "Supabase CLI is required but not installed. Run: npm i -g supabase"; exit 1; }
    command -v pnpm >/dev/null 2>&1 || { log_error "pnpm is required but not installed."; exit 1; }
    
    # Check if user is logged in
    if ! vercel whoami >/dev/null 2>&1; then
        log_error "Please login to Vercel: vercel login"
        exit 1
    fi
    
    if ! supabase status >/dev/null 2>&1; then
        log_warning "Supabase not connected. Please run: supabase login"
    fi
    
    log_success "Prerequisites check passed"
}

# Setup Supabase Production Database
setup_production_database() {
    log_info "Setting up production database..."
    
    # Create production Supabase project (manual step - provide instructions)
    echo "📋 MANUAL STEP REQUIRED:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Create new project: 'caring-compass-prod'"
    echo "3. Choose region: us-east-1 (closest to Virginia)"
    echo "4. Note down the project URL and anon key"
    echo ""
    read -p "Press Enter once you've created the Supabase project..."
    
    # Get production database URL
    read -p "Enter production DATABASE_URL: " PROD_DB_URL
    read -p "Enter production SUPABASE_URL: " PROD_SUPABASE_URL
    read -p "Enter production SUPABASE_ANON_KEY: " PROD_SUPABASE_ANON_KEY
    read -p "Enter production SUPABASE_SERVICE_KEY: " PROD_SUPABASE_SERVICE_KEY
    
    # Run database migrations
    log_info "Running database migrations..."
    cd packages/database
    DATABASE_URL="$PROD_DB_URL" npx prisma migrate deploy
    DATABASE_URL="$PROD_DB_URL" npx prisma generate
    
    log_success "Production database setup completed"
}

# Setup Redis Production Instance
setup_redis() {
    log_info "Setting up Redis (Upstash)..."
    
    echo "📋 MANUAL STEP REQUIRED:"
    echo "1. Go to https://upstash.com"
    echo "2. Create Redis database: 'caring-compass-prod'"
    echo "3. Choose region: us-east-1"
    echo ""
    read -p "Enter REDIS_URL: " REDIS_URL
    
    log_success "Redis configuration completed"
}

# Setup Stripe Production
setup_stripe() {
    log_info "Setting up Stripe production..."
    
    echo "📋 MANUAL STEP REQUIRED:"
    echo "1. Go to https://dashboard.stripe.com"
    echo "2. Switch to production mode"
    echo "3. Get your production API keys"
    echo "4. Setup webhooks for: https://$DOMAIN/api/webhooks/stripe"
    echo ""
    read -p "Enter STRIPE_SECRET_KEY (production): " STRIPE_SECRET_KEY
    read -p "Enter STRIPE_PUBLISHABLE_KEY (production): " STRIPE_PUBLISHABLE_KEY
    read -p "Enter STRIPE_WEBHOOK_SECRET: " STRIPE_WEBHOOK_SECRET
    
    log_success "Stripe configuration completed"
}

# Setup Email Service (SendGrid/Resend)
setup_email() {
    log_info "Setting up email service..."
    
    echo "📋 Choose email provider:"
    echo "1. SendGrid"
    echo "2. Resend"
    read -p "Enter choice (1 or 2): " email_choice
    
    if [ "$email_choice" = "1" ]; then
        echo "Setting up SendGrid..."
        read -p "Enter SENDGRID_API_KEY: " SENDGRID_API_KEY
        EMAIL_PROVIDER="sendgrid"
        EMAIL_API_KEY="$SENDGRID_API_KEY"
    else
        echo "Setting up Resend..."
        read -p "Enter RESEND_API_KEY: " RESEND_API_KEY
        EMAIL_PROVIDER="resend"
        EMAIL_API_KEY="$RESEND_API_KEY"
    fi
    
    log_success "Email service configuration completed"
}

# Setup SMS Service (Twilio)
setup_sms() {
    log_info "Setting up SMS service (Twilio)..."
    
    echo "📋 MANUAL STEP REQUIRED:"
    echo "1. Go to https://console.twilio.com"
    echo "2. Get your Account SID and Auth Token"
    echo "3. Purchase a phone number"
    echo ""
    read -p "Enter TWILIO_ACCOUNT_SID: " TWILIO_ACCOUNT_SID
    read -p "Enter TWILIO_AUTH_TOKEN: " TWILIO_AUTH_TOKEN
    read -p "Enter TWILIO_PHONE_NUMBER: " TWILIO_PHONE_NUMBER
    
    log_success "SMS service configuration completed"
}

# Setup Monitoring (Sentry + Logtail)
setup_monitoring() {
    log_info "Setting up monitoring services..."
    
    echo "📋 Setting up Sentry..."
    echo "1. Go to https://sentry.io"
    echo "2. Create project: 'caring-compass'"
    echo ""
    read -p "Enter SENTRY_DSN: " SENTRY_DSN
    
    echo "📋 Setting up Logtail..."
    echo "1. Go to https://logtail.com"
    echo "2. Create source: 'caring-compass-prod'"
    echo ""
    read -p "Enter LOGTAIL_TOKEN: " LOGTAIL_TOKEN
    
    log_success "Monitoring services configuration completed"
}

# Create environment files
create_env_files() {
    log_info "Creating production environment files..."
    
    # Create .env.production for web app
    cat > apps/web/.env.production << EOF
# Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://$DOMAIN

# Database
DATABASE_URL=$PROD_DB_URL

# Supabase
SUPABASE_URL=$PROD_SUPABASE_URL
SUPABASE_ANON_KEY=$PROD_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=$PROD_SUPABASE_SERVICE_KEY

# Redis
REDIS_URL=$REDIS_URL

# Stripe
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET

# Email
EMAIL_PROVIDER=$EMAIL_PROVIDER
EMAIL_API_KEY=$EMAIL_API_KEY
EMAIL_FROM=noreply@$DOMAIN

# SMS
TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER

# Monitoring
SENTRY_DSN=$SENTRY_DSN
LOGTAIL_TOKEN=$LOGTAIL_TOKEN

# Security
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://$DOMAIN

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx
EOF

    log_success "Environment files created"
}

# Build application
build_application() {
    log_info "Building application for production..."
    
    # Install dependencies
    pnpm install --frozen-lockfile
    
    # Build all packages
    pnpm run build:packages
    
    # Build web application
    cd apps/web
    pnpm run build
    
    log_success "Application build completed"
    cd ../..
}

# Deploy to Vercel
deploy_to_vercel() {
    log_info "Deploying to Vercel..."
    
    cd apps/web
    
    # Deploy to staging first
    log_info "Deploying to staging environment..."
    vercel --prod=false --confirm
    
    # Get staging URL for testing
    STAGING_URL=$(vercel ls | grep staging | head -1 | awk '{print $2}')
    log_success "Staging deployed: $STAGING_URL"
    
    # Run smoke tests on staging
    log_info "Running smoke tests on staging..."
    npm run test:smoke -- --url=$STAGING_URL
    
    # Deploy to production
    read -p "Staging tests passed. Deploy to production? (y/n): " deploy_prod
    
    if [ "$deploy_prod" = "y" ]; then
        log_info "Deploying to production..."
        vercel --prod --confirm
        
        # Add custom domain
        vercel domains add $DOMAIN
        log_success "Production deployed: https://$DOMAIN"
    fi
    
    cd ../..
}

# Setup Cloudflare DNS and CDN
setup_cloudflare() {
    log_info "Setting up Cloudflare..."
    
    echo "📋 MANUAL STEP REQUIRED:"
    echo "1. Go to https://cloudflare.com"
    echo "2. Add domain: $DOMAIN"
    echo "3. Update nameservers at your domain registrar"
    echo "4. Create CNAME record: @ -> cname.vercel-dns.com"
    echo "5. Enable SSL/TLS Full (strict)"
    echo "6. Enable Always Use HTTPS"
    echo "7. Enable HSTS"
    echo ""
    read -p "Press Enter once Cloudflare is configured..."
    
    log_success "Cloudflare configuration completed"
}

# Setup CI/CD Pipeline
setup_cicd() {
    log_info "Setting up CI/CD pipeline..."
    
    # Create GitHub Actions workflow for production
    mkdir -p .github/workflows
    
    cat > .github/workflows/production-deploy.yml << EOF
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test & Quality Assurance
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Type check
        run: pnpm run type-check
        
      - name: Lint
        run: pnpm run lint
        
      - name: Run tests
        run: pnpm run test:ci
        
      - name: Build packages
        run: pnpm run build:packages
        
      - name: Security audit
        run: pnpm audit --audit-level moderate

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build application
        run: pnpm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./apps/web
EOF

    log_success "CI/CD pipeline configured"
}

# Main deployment function
main() {
    log_info "Starting Caring Compass production deployment..."
    
    check_prerequisites
    setup_production_database
    setup_redis
    setup_stripe
    setup_email
    setup_sms
    setup_monitoring
    create_env_files
    build_application
    deploy_to_vercel
    setup_cloudflare
    setup_cicd
    
    log_success "🎉 Production deployment completed!"
    echo ""
    echo "📋 POST-DEPLOYMENT CHECKLIST:"
    echo "1. ✅ Verify application is accessible at https://$DOMAIN"
    echo "2. ⏳ Test user registration and login"
    echo "3. ⏳ Test payment processing with Stripe"
    echo "4. ⏳ Test email notifications"
    echo "5. ⏳ Test SMS notifications"
    echo "6. ⏳ Verify monitoring and error tracking"
    echo "7. ⏳ Run security scan"
    echo "8. ⏳ Test backup and restore procedures"
    echo ""
    echo "🌐 Application URLs:"
    echo "Production: https://$DOMAIN"
    echo "Staging: https://$STAGING_DOMAIN"
    echo ""
    echo "📊 Monitoring URLs:"
    echo "Sentry: https://sentry.io"
    echo "Logtail: https://logtail.com"
    echo "Vercel: https://vercel.com/dashboard"
}

# Run main function
main "$@"