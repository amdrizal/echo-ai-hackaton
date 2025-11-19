#!/bin/bash

# validate-setup.sh - Validation script for Echo-AI setup
# Checks that all components are properly configured and running

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

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to print colored output
print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

check_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    PASSED=$((PASSED + 1))
}

check_fail() {
    echo -e "${RED}✗ $1${NC}"
    FAILED=$((FAILED + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

print_section() {
    echo -e "\n${MAGENTA}>>> $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if file exists
file_exists() {
    [ -f "$1" ]
}

# Function to check if directory exists
dir_exists() {
    [ -d "$1" ]
}

# Section 1: System Requirements
validate_system() {
    print_section "System Requirements"

    if command_exists "node"; then
        local version=$(node --version)
        check_pass "Node.js installed ($version)"
    else
        check_fail "Node.js not installed"
    fi

    if command_exists "npm"; then
        local version=$(npm --version)
        check_pass "npm installed ($version)"
    else
        check_fail "npm not installed"
    fi

    if command_exists "git"; then
        local version=$(git --version)
        check_pass "Git installed"
    else
        check_warn "Git not installed (optional)"
    fi

    if command_exists "psql"; then
        local version=$(psql --version)
        check_pass "PostgreSQL client installed"
    else
        check_warn "PostgreSQL client not installed (optional for configuration)"
    fi
}

# Section 2: Project Structure
validate_structure() {
    print_section "Project Structure"

    if dir_exists "$SCRIPT_DIR/backend"; then
        check_pass "Backend directory exists"
    else
        check_fail "Backend directory missing"
    fi

    if dir_exists "$SCRIPT_DIR/mobile"; then
        check_pass "Mobile directory exists"
    else
        check_fail "Mobile directory missing"
    fi

    if file_exists "$SCRIPT_DIR/backend/package.json"; then
        check_pass "Backend package.json exists"
    else
        check_fail "Backend package.json missing"
    fi

    if file_exists "$SCRIPT_DIR/mobile/package.json"; then
        check_pass "Mobile package.json exists"
    else
        check_fail "Mobile package.json missing"
    fi
}

# Section 3: Helper Scripts
validate_scripts() {
    print_section "Helper Scripts"

    if file_exists "$SCRIPT_DIR/setup-env.sh"; then
        if [ -x "$SCRIPT_DIR/setup-env.sh" ]; then
            check_pass "setup-env.sh exists and is executable"
        else
            check_warn "setup-env.sh exists but is not executable"
        fi
    else
        check_fail "setup-env.sh not found"
    fi

    if file_exists "$SCRIPT_DIR/quick-start.sh"; then
        if [ -x "$SCRIPT_DIR/quick-start.sh" ]; then
            check_pass "quick-start.sh exists and is executable"
        else
            check_warn "quick-start.sh exists but is not executable"
        fi
    else
        check_fail "quick-start.sh not found"
    fi

    if file_exists "$SCRIPT_DIR/setup-all.sh"; then
        if [ -x "$SCRIPT_DIR/setup-all.sh" ]; then
            check_pass "setup-all.sh exists and is executable"
        else
            check_warn "setup-all.sh exists but is not executable"
        fi
    else
        check_fail "setup-all.sh not found"
    fi

    if file_exists "$SCRIPT_DIR/seed-demo-data.sql"; then
        check_pass "seed-demo-data.sql exists"
    else
        check_fail "seed-demo-data.sql not found"
    fi
}

# Section 4: Environment Configuration
validate_environment() {
    print_section "Environment Configuration"

    if file_exists "$SCRIPT_DIR/backend/.env"; then
        check_pass "Backend .env file exists"

        # Check for required variables
        if grep -q "DATABASE_URL" "$SCRIPT_DIR/backend/.env"; then
            check_pass "Backend DATABASE_URL configured"
        else
            check_warn "Backend DATABASE_URL not configured"
        fi

        if grep -q "JWT_SECRET" "$SCRIPT_DIR/backend/.env"; then
            check_pass "Backend JWT_SECRET configured"
        else
            check_warn "Backend JWT_SECRET not configured"
        fi
    else
        check_warn "Backend .env file not found (run ./setup-env.sh)"
    fi

    if file_exists "$SCRIPT_DIR/mobile/.env"; then
        check_pass "Mobile .env file exists"

        if grep -q "EXPO_PUBLIC_API_URL" "$SCRIPT_DIR/mobile/.env"; then
            check_pass "Mobile API_URL configured"
        else
            check_warn "Mobile API_URL not configured"
        fi
    else
        check_warn "Mobile .env file not found (run ./setup-env.sh)"
    fi

    if file_exists "$SCRIPT_DIR/backend/.env.example"; then
        check_pass "Backend .env.example exists"
    else
        check_warn "Backend .env.example not found"
    fi

    if file_exists "$SCRIPT_DIR/mobile/.env.example"; then
        check_pass "Mobile .env.example exists"
    else
        check_warn "Mobile .env.example not found"
    fi
}

# Section 5: Dependencies
validate_dependencies() {
    print_section "Dependencies"

    if dir_exists "$SCRIPT_DIR/backend/node_modules"; then
        local count=$(find "$SCRIPT_DIR/backend/node_modules" -maxdepth 1 -type d | wc -l)
        if [ $count -gt 10 ]; then
            check_pass "Backend node_modules installed ($(($count - 1)) packages)"
        else
            check_warn "Backend node_modules appears incomplete"
        fi
    else
        check_warn "Backend node_modules not installed (run ./setup-all.sh)"
    fi

    if dir_exists "$SCRIPT_DIR/mobile/node_modules"; then
        local count=$(find "$SCRIPT_DIR/mobile/node_modules" -maxdepth 1 -type d | wc -l)
        if [ $count -gt 10 ]; then
            check_pass "Mobile node_modules installed ($(($count - 1)) packages)"
        else
            check_warn "Mobile node_modules appears incomplete"
        fi
    else
        check_warn "Mobile node_modules not installed (run ./setup-all.sh)"
    fi
}

# Section 6: Documentation
validate_documentation() {
    print_section "Documentation"

    if file_exists "$SCRIPT_DIR/SCRIPTS-README.md"; then
        check_pass "SCRIPTS-README.md exists"
    else
        check_warn "SCRIPTS-README.md not found"
    fi

    if file_exists "$SCRIPT_DIR/SETUP-QUICKSTART.md"; then
        check_pass "SETUP-QUICKSTART.md exists"
    else
        check_warn "SETUP-QUICKSTART.md not found"
    fi

    if file_exists "$SCRIPT_DIR/CLAUDE.md"; then
        check_pass "CLAUDE.md (project config) exists"
    else
        check_warn "CLAUDE.md not found"
    fi
}

# Section 7: Database
validate_database() {
    print_section "Database"

    if ! command_exists "psql"; then
        check_warn "PostgreSQL client not installed - skipping database checks"
        return
    fi

    if [ -f "$SCRIPT_DIR/backend/.env" ]; then
        source "$SCRIPT_DIR/backend/.env" 2>/dev/null || true

        if [ -z "$DATABASE_URL" ]; then
            check_warn "DATABASE_URL not set in backend/.env"
            return
        fi

        # Try connecting to database
        if PGPASSWORD=$(echo "$DATABASE_URL" | grep -oP '(?<=:)\K[^@]+(?=@)' 2>/dev/null) psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1; then
            check_pass "PostgreSQL database is accessible"

            # Check for tables
            if PGPASSWORD=$(echo "$DATABASE_URL" | grep -oP '(?<=:)\K[^@]+(?=@)' 2>/dev/null) psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'" >/dev/null 2>&1; then
                check_pass "Database schema exists"
            else
                check_warn "Database schema may not be initialized (run migrations)"
            fi
        else
            check_warn "Cannot connect to PostgreSQL database"
            echo "   Make sure PostgreSQL is running and credentials are correct"
        fi
    else
        check_warn "backend/.env not found - cannot check database"
    fi
}

# Section 8: Services Running
validate_services() {
    print_section "Running Services"

    if [ -f "$SCRIPT_DIR/.backend.pid" ]; then
        local pid=$(cat "$SCRIPT_DIR/.backend.pid")
        if kill -0 $pid 2>/dev/null; then
            check_pass "Backend service is running (PID: $pid)"

            # Try to reach API
            if command_exists "curl"; then
                if timeout 2 curl -s http://localhost:3000 >/dev/null 2>&1; then
                    check_pass "Backend API is responding"
                else
                    check_warn "Backend API not responding at http://localhost:3000"
                fi
            fi
        else
            check_warn "Backend PID file exists but process not running"
        fi
    else
        check_warn "Backend service not running (use ./quick-start.sh to start)"
    fi

    if [ -f "$SCRIPT_DIR/.mobile.pid" ]; then
        local pid=$(cat "$SCRIPT_DIR/.mobile.pid")
        if kill -0 $pid 2>/dev/null; then
            check_pass "Mobile/Frontend service is running (PID: $pid)"
        else
            check_warn "Mobile PID file exists but process not running"
        fi
    else
        check_warn "Mobile service not running (use ./quick-start.sh to start)"
    fi
}

# Section 9: Demo Data
validate_demo_data() {
    print_section "Demo Data"

    if ! command_exists "psql"; then
        check_warn "PostgreSQL client not available - skipping demo data check"
        return
    fi

    if [ -f "$SCRIPT_DIR/backend/.env" ]; then
        source "$SCRIPT_DIR/backend/.env" 2>/dev/null || true

        if [ -z "$DATABASE_URL" ]; then
            check_warn "DATABASE_URL not set - skipping demo data check"
            return
        fi

        # Check for demo user
        if PGPASSWORD=$(echo "$DATABASE_URL" | grep -oP '(?<=:)\K[^@]+(?=@)' 2>/dev/null) psql "$DATABASE_URL" -c "SELECT 1 FROM users WHERE email='demo@echoai.com'" >/dev/null 2>&1; then
            check_pass "Demo user exists (demo@echoai.com)"

            # Check for sample goals
            if PGPASSWORD=$(echo "$DATABASE_URL" | grep -oP '(?<=:)\K[^@]+(?=@)' 2>/dev/null) psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM goals WHERE user_id IN (SELECT id FROM users WHERE email='demo@echoai.com')" 2>/dev/null | grep -q "[0-9]"; then
                check_pass "Demo goals loaded"
            fi
        else
            check_warn "Demo user not found (run: psql -d echoai_dev -f seed-demo-data.sql)"
        fi
    else
        check_warn "backend/.env not found - cannot check demo data"
    fi
}

# Summary
show_summary() {
    echo ""
    print_header "Validation Summary"

    echo -e "${GREEN}Passed:${NC}   $PASSED"
    echo -e "${RED}Failed:${NC}   $FAILED"
    echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
    echo ""

    if [ $FAILED -eq 0 ]; then
        if [ $WARNINGS -eq 0 ]; then
            echo -e "${GREEN}Perfect! Everything is configured correctly.${NC}"
            echo ""
            echo "Next step: Start services"
            echo "  ./quick-start.sh"
        else
            echo -e "${YELLOW}Setup is functional but has some optional items unconfigured.${NC}"
            echo ""
            echo "You can still start services:"
            echo "  ./quick-start.sh"
        fi
    else
        echo -e "${RED}Setup has critical issues that need to be fixed:${NC}"
        echo ""
        echo "See recommendations above, then run:"
        echo "  ./setup-all.sh"
        echo ""
        echo "Or fix issues manually and re-run:"
        echo "  ./validate-setup.sh"
    fi

    echo ""
}

# Main
main() {
    print_header "Echo-AI Setup Validation"

    validate_system
    validate_structure
    validate_scripts
    validate_environment
    validate_dependencies
    validate_documentation
    validate_database
    validate_services
    validate_demo_data

    show_summary

    # Return exit code based on failures
    if [ $FAILED -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

main "$@"
