#!/bin/bash

# Echo-AI Deployment Script for Render.com
# This script helps you deploy your hackathon project to production

set -e  # Exit on error

echo "🚀 Echo-AI Deployment Helper"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if git repo
if [ ! -d .git ]; then
    print_error "Not a git repository. Initialize git first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    exit 1
fi

print_success "Git repository detected"

# Check if files exist
echo ""
echo "Checking required files..."

if [ -f "backend/render.yaml" ]; then
    print_success "backend/render.yaml exists"
else
    print_error "backend/render.yaml missing"
    exit 1
fi

if [ -f "backend/package.json" ]; then
    print_success "backend/package.json exists"
else
    print_error "backend/package.json missing"
    exit 1
fi

if [ -f "mobile/package.json" ]; then
    print_success "mobile/package.json exists"
else
    print_error "mobile/package.json missing"
    exit 1
fi

# Check if changes need to be committed
if [[ -n $(git status -s) ]]; then
    print_info "You have uncommitted changes"
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        print_success "Changes committed"
    fi
fi

# Push to GitHub
echo ""
print_info "Pushing to GitHub..."
read -p "Enter remote name (default: origin): " remote
remote=${remote:-origin}
read -p "Enter branch name (default: main): " branch
branch=${branch:-main}

if git push $remote $branch; then
    print_success "Pushed to $remote/$branch"
else
    print_error "Failed to push. Make sure you've set up a remote:"
    echo "  git remote add origin https://github.com/username/repo.git"
    exit 1
fi

# Instructions for Render deployment
echo ""
echo "=============================="
echo "📋 Next Steps - Deploy to Render"
echo "=============================="
echo ""
echo "BACKEND DEPLOYMENT:"
echo "-------------------"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure:"
echo "   - Name: echo-ai-backend"
echo "   - Region: Singapore"
echo "   - Branch: $branch"
echo "   - Root Directory: backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "5. Add Environment Variables:"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   DATABASE_URL=postgresql://admin:bImNAvwK5yQz0gCGoY73faW0MOonw8VD@dpg-d45hbn3ipnbc738lla4g-a/hackaton_dyw8"
echo "   JWT_SECRET=f80fb9fa5feaa319733cf3bbcb9c3740321b3d0ac22159abc2f6fb686395dee
  983da1667a1a3c91cda93d65225495e9db5b1c844b0f431fb639a99796e3890e1"
echo "   VAPI_API_KEY=03baffac-91a5-4d19-b0f3-45e5be2eca3f"
echo ""
echo "6. Click 'Create Web Service'"
echo ""

echo "FRONTEND DEPLOYMENT:"
echo "--------------------"
echo "1. Click 'New +' → 'Static Site'"
echo "2. Select your repository"
echo "3. Configure:"
echo "   - Name: echo-ai-web"
echo "   - Branch: $branch"
echo "   - Root Directory: mobile"
echo "   - Build Command: npm install && npx expo export:web"
echo "   - Publish Directory: web-build"
echo ""
echo "4. Add Environment Variables:"
echo "   EXPO_PUBLIC_API_URL=https://echo-ai-backend.onrender.com/api/v1"
echo "   EXPO_PUBLIC_VAPI_PUBLIC_KEY=20123b06-1118-478c-aadd-4ee130f93a35"
echo "   EXPO_PUBLIC_VAPI_ASSISTANT_ID=86b1f3f9-0a8a-49d7-93e9-a11657bede91"
echo ""
echo "5. Click 'Create Static Site'"
echo ""

echo "DATABASE INITIALIZATION:"
echo "------------------------"
echo "After backend is deployed:"
echo "1. In Render dashboard, go to your backend service"
echo "2. Click 'Shell' tab"
echo "3. Run: node init-db.js"
echo ""

echo "=============================="
print_success "Deployment preparation complete!"
echo "=============================="
echo ""
print_info "Read RENDER-DEPLOYMENT.md for detailed instructions"
