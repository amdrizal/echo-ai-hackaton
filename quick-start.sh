#!/bin/bash

# quick-start.sh - Automated startup script for Echo-AI
# Validates prerequisites, starts backend and frontend, and monitors services

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
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if file/directory exists
file_exists() {
    [ -f "$1" ]
}

dir_exists() {
    [ -d "$1" ]
}

# Function to check if Node.js modules are installed
check_npm_modules() {
    local dir=$1
    local project_name=$2

    if [ ! -d "$dir/node_modules" ]; then
        print_warning "$project_name node_modules not found"
        return 1
    else
        print_success "$project_name dependencies installed"
        return 0
    fi
}

# Function to check if .env file exists
check_env_file() {
    local env_file=$1
    local project_name=$2

    if [ ! -f "$env_file" ]; then
        print_error "$project_name .env file not found at $env_file"
        return 1
    else
        print_success "$project_name .env file configured"
        return 0
    fi
}

# Function to check PostgreSQL connection
check_postgres_connection() {
    local db_url=$1

    if command_exists "psql"; then
        # Extract connection string components
        if [[ $db_url =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
            local user="${BASH_REMATCH[1]}"
            local password="${BASH_REMATCH[2]}"
            local host="${BASH_REMATCH[3]}"
            local port="${BASH_REMATCH[4]}"
            local database="${BASH_REMATCH[5]}"

            # Try to connect
            if PGPASSWORD="$password" psql -h "$host" -p "$port" -U "$user" -d "$database" -c "SELECT 1" >/dev/null 2>&1; then
                print_success "PostgreSQL database is accessible"
                return 0
            else
                print_warning "Cannot connect to PostgreSQL database"
                print_info "Make sure PostgreSQL is running on $host:$port"
                return 1
            fi
        fi
    else
        print_info "psql not found - skipping database connection check"
        return 0
    fi
}

# Function to start backend service
start_backend() {
    local backend_dir="$SCRIPT_DIR/backend"

    print_header "Starting Backend Service"

    # Check prerequisites
    if ! dir_exists "$backend_dir"; then
        print_error "Backend directory not found at $backend_dir"
        return 1
    fi

    if ! check_npm_modules "$backend_dir" "Backend"; then
        print_info "Installing backend dependencies..."
        cd "$backend_dir"
        npm install
        cd "$SCRIPT_DIR"
    fi

    if ! check_env_file "$backend_dir/.env" "Backend"; then
        print_error "Please run ./setup-env.sh first"
        return 1
    fi

    # Check database connection
    if [ -f "$backend_dir/.env" ]; then
        source "$backend_dir/.env"
        if [ -n "$DATABASE_URL" ]; then
            check_postgres_connection "$DATABASE_URL" || print_warning "Database connection check failed - continuing anyway"
        fi
    fi

    echo ""
    print_info "Starting backend server..."
    cd "$backend_dir"

    # Start backend in background
    npm run dev > "$SCRIPT_DIR/.backend.log" 2>&1 &
    local backend_pid=$!

    # Give server time to start
    sleep 3

    # Check if process is still running
    if kill -0 $backend_pid 2>/dev/null; then
        print_success "Backend started (PID: $backend_pid)"
        echo $backend_pid > "$SCRIPT_DIR/.backend.pid"
        cd "$SCRIPT_DIR"
        return 0
    else
        print_error "Backend failed to start"
        echo "--- Backend Logs ---"
        cat "$SCRIPT_DIR/.backend.log"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

# Function to start mobile service
start_mobile() {
    local mobile_dir="$SCRIPT_DIR/mobile"

    print_header "Starting Mobile/Frontend Service"

    # Check prerequisites
    if ! dir_exists "$mobile_dir"; then
        print_error "Mobile directory not found at $mobile_dir"
        return 1
    fi

    if ! check_npm_modules "$mobile_dir" "Mobile"; then
        print_info "Installing mobile dependencies..."
        cd "$mobile_dir"
        npm install
        cd "$SCRIPT_DIR"
    fi

    if ! check_env_file "$mobile_dir/.env" "Mobile"; then
        print_error "Please run ./setup-env.sh first"
        return 1
    fi

    echo ""
    print_info "Starting Expo development server..."
    cd "$mobile_dir"

    # Start mobile in background
    npm start > "$SCRIPT_DIR/.mobile.log" 2>&1 &
    local mobile_pid=$!

    # Give server time to start
    sleep 3

    # Check if process is still running
    if kill -0 $mobile_pid 2>/dev/null; then
        print_success "Mobile/Frontend started (PID: $mobile_pid)"
        echo $mobile_pid > "$SCRIPT_DIR/.mobile.pid"
        cd "$SCRIPT_DIR"
        return 0
    else
        print_error "Mobile/Frontend failed to start"
        echo "--- Mobile Logs ---"
        cat "$SCRIPT_DIR/.mobile.log"
        cd "$SCRIPT_DIR"
        return 1
    fi
}

# Function to show service status
show_status() {
    print_header "Service Status"

    echo ""
    echo -e "${YELLOW}Backend Service:${NC}"
    if [ -f "$SCRIPT_DIR/.backend.pid" ]; then
        local backend_pid=$(cat "$SCRIPT_DIR/.backend.pid")
        if kill -0 $backend_pid 2>/dev/null; then
            print_success "Running (PID: $backend_pid)"
            echo "  URL: http://localhost:3000"
            echo "  Logs: tail -f $SCRIPT_DIR/.backend.log"
        else
            print_error "Not running (PID file stale)"
            rm "$SCRIPT_DIR/.backend.pid"
        fi
    else
        print_error "Not running"
    fi

    echo ""
    echo -e "${YELLOW}Mobile/Frontend Service:${NC}"
    if [ -f "$SCRIPT_DIR/.mobile.pid" ]; then
        local mobile_pid=$(cat "$SCRIPT_DIR/.mobile.pid")
        if kill -0 $mobile_pid 2>/dev/null; then
            print_success "Running (PID: $mobile_pid)"
            echo "  Expo Dev Server"
            echo "  Logs: tail -f $SCRIPT_DIR/.mobile.log"
        else
            print_error "Not running (PID file stale)"
            rm "$SCRIPT_DIR/.mobile.pid"
        fi
    else
        print_error "Not running"
    fi

    echo ""
}

# Function to stop services
stop_services() {
    print_header "Stopping Services"

    if [ -f "$SCRIPT_DIR/.backend.pid" ]; then
        local backend_pid=$(cat "$SCRIPT_DIR/.backend.pid")
        if kill -0 $backend_pid 2>/dev/null; then
            kill $backend_pid
            print_success "Backend stopped"
            rm "$SCRIPT_DIR/.backend.pid"
        fi
    fi

    if [ -f "$SCRIPT_DIR/.mobile.pid" ]; then
        local mobile_pid=$(cat "$SCRIPT_DIR/.mobile.pid")
        if kill -0 $mobile_pid 2>/dev/null; then
            kill $mobile_pid
            print_success "Mobile/Frontend stopped"
            rm "$SCRIPT_DIR/.mobile.pid"
        fi
    fi

    echo ""
}

# Function to display help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "OPTIONS:"
    echo "  start       Start both backend and mobile services (default)"
    echo "  stop        Stop all running services"
    echo "  status      Show status of services"
    echo "  restart     Restart all services"
    echo "  logs-backend Show backend logs"
    echo "  logs-mobile Show mobile logs"
    echo "  help        Display this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start services"
    echo "  $0 status         # Check service status"
    echo "  $0 stop           # Stop all services"
    echo "  $0 logs-backend   # View backend logs"
    echo ""
}

# Main execution
main() {
    local command=${1:-start}

    case $command in
        start)
            print_header "Echo-AI Quick Start"
            echo ""

            # Check for required tools
            if ! command_exists "node"; then
                print_error "Node.js is not installed"
                exit 1
            fi
            print_success "Node.js is installed"

            if ! command_exists "npm"; then
                print_error "npm is not installed"
                exit 1
            fi
            print_success "npm is installed"

            echo ""

            # Start services
            start_backend || {
                print_error "Failed to start backend"
                exit 1
            }

            echo ""

            start_mobile || {
                print_error "Failed to start mobile/frontend"
                # Don't exit - backend might still be useful
            }

            echo ""
            show_status

            echo -e "${YELLOW}Setup Instructions:${NC}"
            echo "1. Backend API: http://localhost:3000"
            echo "2. Mobile Dev: Check Expo Metro Bundler terminal"
            echo "3. To view logs: tail -f .backend.log or tail -f .mobile.log"
            echo "4. To stop services: ./quick-start.sh stop"
            echo ""
            ;;

        stop)
            stop_services
            ;;

        status)
            show_status
            ;;

        restart)
            stop_services
            echo ""
            sleep 1
            main start
            ;;

        logs-backend)
            if [ -f "$SCRIPT_DIR/.backend.log" ]; then
                tail -f "$SCRIPT_DIR/.backend.log"
            else
                print_error "Backend log file not found"
            fi
            ;;

        logs-mobile)
            if [ -f "$SCRIPT_DIR/.mobile.log" ]; then
                tail -f "$SCRIPT_DIR/.mobile.log"
            else
                print_error "Mobile log file not found"
            fi
            ;;

        help)
            show_help
            ;;

        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Set up signal handlers
trap 'stop_services' SIGINT SIGTERM

main "$@"
