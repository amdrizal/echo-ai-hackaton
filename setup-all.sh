#!/bin/bash

# setup-all.sh - Master setup script for Echo-AI
# This script orchestrates the complete setup process in the recommended order

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${MAGENTA}ℹ $1${NC}"
}

print_section() {
    echo -e "\n${MAGENTA}>> $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to confirm with user
confirm() {
    local prompt="$1"
    local response
    while true; do
        echo -n -e "${YELLOW}$prompt (y/n) [y]: ${NC}"
        read response
        response=${response:-y}
        case "$response" in
            [yY][eE][sS] | [yY])
                return 0
                ;;
            [nN][oO] | [nN])
                return 1
                ;;
            *)
                echo "Please answer yes or no."
                ;;
        esac
    done
}

# Step 1: Prerequisites check
check_prerequisites() {
    print_section "Checking prerequisites..."

    local missing_tools=0

    if ! command_exists "node"; then
        print_error "Node.js is not installed"
        missing_tools=$((missing_tools + 1))
    else
        local node_version=$(node --version)
        print_success "Node.js installed ($node_version)"
    fi

    if ! command_exists "npm"; then
        print_error "npm is not installed"
        missing_tools=$((missing_tools + 1))
    else
        local npm_version=$(npm --version)
        print_success "npm installed ($npm_version)"
    fi

    if ! command_exists "psql"; then
        print_warning "PostgreSQL client (psql) not found - you can still configure, but database operations will be skipped"
    else
        local pg_version=$(psql --version)
        print_success "PostgreSQL client installed ($pg_version)"
    fi

    if [ $missing_tools -gt 0 ]; then
        print_error "$missing_tools prerequisite(s) missing"
        echo ""
        echo "Please install:"
        echo "  - Node.js: https://nodejs.org (v16+ recommended)"
        echo "  - npm: Included with Node.js"
        echo "  - PostgreSQL: https://www.postgresql.org/download/"
        return 1
    fi

    return 0
}

# Step 2: Configure environment variables
configure_environment() {
    print_header "Step 1: Environment Configuration"

    if [ -f "$SCRIPT_DIR/backend/.env" ] && [ -f "$SCRIPT_DIR/mobile/.env" ]; then
        print_info "Environment files already configured"
        if ! confirm "Reconfigure environment variables?"; then
            return 0
        fi
    fi

    if [ -f "$SCRIPT_DIR/setup-env.sh" ]; then
        bash "$SCRIPT_DIR/setup-env.sh"
        if [ $? -eq 0 ]; then
            print_success "Environment configuration completed"
            return 0
        else
            print_error "Environment configuration failed"
            return 1
        fi
    else
        print_error "setup-env.sh not found"
        return 1
    fi
}

# Step 3: Install dependencies
install_dependencies() {
    print_header "Step 2: Installing Dependencies"

    print_section "Backend dependencies..."
    if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
        echo "Installing backend dependencies (this may take a few minutes)..."
        cd "$SCRIPT_DIR/backend"
        npm install
        if [ $? -eq 0 ]; then
            print_success "Backend dependencies installed"
        else
            print_error "Failed to install backend dependencies"
            cd "$SCRIPT_DIR"
            return 1
        fi
        cd "$SCRIPT_DIR"
    else
        print_success "Backend dependencies already installed"
    fi

    print_section "Mobile dependencies..."
    if [ ! -d "$SCRIPT_DIR/mobile/node_modules" ]; then
        echo "Installing mobile dependencies (this may take a few minutes)..."
        cd "$SCRIPT_DIR/mobile"
        npm install
        if [ $? -eq 0 ]; then
            print_success "Mobile dependencies installed"
        else
            print_error "Failed to install mobile dependencies"
            cd "$SCRIPT_DIR"
            return 1
        fi
        cd "$SCRIPT_DIR"
    else
        print_success "Mobile dependencies already installed"
    fi

    return 0
}

# Step 4: Database setup
setup_database() {
    print_header "Step 3: Database Setup"

    if ! command_exists "psql"; then
        print_warning "PostgreSQL client not available - skipping database setup"
        print_info "Manual database setup:"
        echo "  1. Create database: createdb echoai_dev"
        echo "  2. Run migrations: cd backend && npm run db:migrate"
        return 0
    fi

    # Extract database URL from .env
    if [ -f "$SCRIPT_DIR/backend/.env" ]; then
        source "$SCRIPT_DIR/backend/.env"

        if [ -z "$DATABASE_URL" ]; then
            print_warning "DATABASE_URL not found in backend/.env"
            return 0
        fi

        print_section "Testing database connection..."
        if PGPASSWORD=$(echo "$DATABASE_URL" | grep -oP '(?<=:)\K[^@]+(?=@)') psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1; then
            print_success "Database connection successful"

            print_section "Running database migrations..."
            cd "$SCRIPT_DIR/backend"
            if [ -f "scripts/migrate.js" ] || [ -f "dist/scripts/migrate.js" ]; then
                npm run db:migrate 2>/dev/null || print_warning "Could not run migrations (may not be set up yet)"
            else
                print_info "Migration script not found - you may need to run migrations manually"
            fi
            cd "$SCRIPT_DIR"
        else
            print_warning "Cannot connect to database"
            print_info "Make sure PostgreSQL is running and credentials are correct in backend/.env"
            echo ""
            echo "Quick setup:"
            echo "  1. Start PostgreSQL: brew services start postgresql (macOS)"
            echo "  2. Create database: createdb echoai_dev"
            echo "  3. Re-run this script"
        fi
    fi

    return 0
}

# Step 5: Seed demo data
seed_demo_data() {
    print_header "Step 4: Demo Data (Optional)"

    if ! command_exists "psql"; then
        print_warning "PostgreSQL client not available - cannot seed demo data"
        print_info "To seed later manually:"
        echo "  psql -d echoai_dev -f seed-demo-data.sql"
        return 0
    fi

    if [ ! -f "$SCRIPT_DIR/seed-demo-data.sql" ]; then
        print_warning "seed-demo-data.sql not found"
        return 0
    fi

    if ! confirm "Load demo data (demo@echoai.com / Demo123!)?"; then
        print_info "Skipping demo data - you can load it later with: psql -d echoai_dev -f seed-demo-data.sql"
        return 0
    fi

    print_section "Seeding demo data..."
    if [ -f "$SCRIPT_DIR/backend/.env" ]; then
        source "$SCRIPT_DIR/backend/.env"
        if psql "$DATABASE_URL" -f "$SCRIPT_DIR/seed-demo-data.sql" >/dev/null 2>&1; then
            print_success "Demo data loaded successfully"
            echo ""
            echo "Demo credentials:"
            echo "  Email:    demo@echoai.com"
            echo "  Password: Demo123!"
        else
            print_warning "Could not load demo data"
            print_info "Try manually: psql -d echoai_dev -f seed-demo-data.sql"
        fi
    fi

    return 0
}

# Step 6: Start services
start_services() {
    print_header "Step 5: Starting Services"

    if ! confirm "Start backend and mobile services now?"; then
        print_info "You can start services later with: ./quick-start.sh"
        return 0
    fi

    if [ -f "$SCRIPT_DIR/quick-start.sh" ]; then
        bash "$SCRIPT_DIR/quick-start.sh" start
        return $?
    else
        print_error "quick-start.sh not found"
        return 1
    fi
}

# Summary
show_summary() {
    print_header "Setup Complete!"

    echo -e "${GREEN}Echo-AI is ready for development!${NC}"
    echo ""
    echo "Quick Reference:"
    echo "================================"
    echo ""
    echo "Start Services:"
    echo "  ./quick-start.sh start"
    echo ""
    echo "View Logs:"
    echo "  ./quick-start.sh logs-backend"
    echo "  ./quick-start.sh logs-mobile"
    echo ""
    echo "Check Status:"
    echo "  ./quick-start.sh status"
    echo ""
    echo "Stop Services:"
    echo "  ./quick-start.sh stop"
    echo ""
    echo "Service URLs:"
    echo "  Backend API: http://localhost:3000"
    echo "  Expo Dev: Check terminal output"
    echo ""
    if [ -f "$SCRIPT_DIR/backend/.env" ]; then
        echo "Demo Credentials (if loaded):"
        echo "  Email:    demo@echoai.com"
        echo "  Password: Demo123!"
    fi
    echo ""
    echo "For detailed documentation:"
    echo "  See SCRIPTS-README.md"
    echo "  See CLAUDE.md for project info"
    echo ""
}

# Main execution
main() {
    print_header "Echo-AI Complete Setup"

    echo "This script will:"
    echo "  1. Check prerequisites (Node.js, npm, PostgreSQL)"
    echo "  2. Configure environment variables"
    echo "  3. Install dependencies"
    echo "  4. Setup database"
    echo "  5. Load demo data (optional)"
    echo "  6. Start services"
    echo ""

    # Check prerequisites
    if ! check_prerequisites; then
        print_error "Setup cannot continue without prerequisites"
        exit 1
    fi

    echo ""
    if ! confirm "Continue with setup?"; then
        print_info "Setup cancelled"
        exit 0
    fi

    # Run setup steps
    configure_environment || exit 1
    install_dependencies || exit 1
    setup_database
    seed_demo_data
    start_services

    # Show summary
    echo ""
    show_summary

    echo -e "${GREEN}Happy coding!${NC}\n"
}

# Handle interruption
trap 'echo -e "\n${RED}Setup interrupted${NC}"; exit 130' SIGINT SIGTERM

main "$@"
