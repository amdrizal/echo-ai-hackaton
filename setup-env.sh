#!/bin/bash

# setup-env.sh - Interactive environment configuration script for Echo-AI
# This script guides users through setting up .env files for both backend and mobile

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to validate email format
validate_email() {
    local email=$1
    if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate port number
validate_port() {
    local port=$1
    if [[ $port =~ ^[0-9]+$ ]] && [ "$port" -ge 1 ] && [ "$port" -le 65535 ]; then
        return 0
    else
        return 1
    fi
}

# Function to validate JWT secret (at least 16 characters)
validate_jwt_secret() {
    local secret=$1
    if [ ${#secret} -ge 16 ]; then
        return 0
    else
        return 1
    fi
}

# Function to validate API URL format
validate_api_url() {
    local url=$1
    if [[ $url =~ ^https?:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to prompt for input with validation
prompt_input() {
    local prompt=$1
    local default=$2
    local validator=$3
    local input=""

    while true; do
        if [ -n "$default" ]; then
            echo -n -e "${YELLOW}$prompt${NC} [${default}]: "
        else
            echo -n -e "${YELLOW}$prompt${NC}: "
        fi

        read input

        # Use default if empty
        if [ -z "$input" ] && [ -n "$default" ]; then
            input=$default
        fi

        # Check if validator function is provided and validate
        if [ -n "$validator" ] && [ -n "$input" ]; then
            if $validator "$input"; then
                echo "$input"
                return
            else
                print_error "Invalid input. Please try again."
            fi
        elif [ -n "$input" ]; then
            echo "$input"
            return
        else
            print_error "Input cannot be empty."
        fi
    done
}

# Function to setup backend .env
setup_backend_env() {
    print_header "Backend Environment Configuration"

    local backend_dir="$SCRIPT_DIR/backend"
    local env_file="$backend_dir/.env"
    local example_file="$backend_dir/.env.example"

    # Check if .env.example exists
    if [ ! -f "$example_file" ]; then
        print_error ".env.example not found at $example_file"
        return 1
    fi

    echo "Configuring backend environment variables..."
    echo ""

    # Get backend configuration
    local node_env=$(prompt_input "NODE_ENV" "development")
    local port=$(prompt_input "PORT (3000-65535)" "3000" "validate_port")
    local api_version=$(prompt_input "API_VERSION" "v1")

    echo ""
    echo -e "${YELLOW}Database Configuration:${NC}"
    local db_user=$(prompt_input "Database username" "postgres")
    local db_password=$(prompt_input "Database password" "password")
    local db_host=$(prompt_input "Database host" "localhost")
    local db_port=$(prompt_input "Database port" "5432" "validate_port")
    local db_name=$(prompt_input "Database name" "echoai_dev")

    local db_url="postgresql://$db_user:$db_password@$db_host:$db_port/$db_name"

    echo ""
    echo -e "${YELLOW}JWT Configuration:${NC}"
    local jwt_secret=$(prompt_input "JWT Secret (min 16 chars)" "CHANGE_THIS_SECRET_KEY_TO_SOMETHING_SECURE" "validate_jwt_secret")
    local jwt_expires=$(prompt_input "JWT Expiration" "7d")

    echo ""
    echo -e "${YELLOW}Vapi Configuration:${NC}"
    local vapi_key=$(prompt_input "Vapi API Key" "YOUR_VAPI_API_KEY_HERE")
    local vapi_secret=$(prompt_input "Vapi Webhook Secret" "YOUR_WEBHOOK_SECRET_HERE")

    echo ""
    echo -e "${YELLOW}Pipedream Configuration:${NC}"
    local pipedream_url=$(prompt_input "Pipedream Webhook URL" "YOUR_PIPEDREAM_WEBHOOK_URL_HERE")

    echo ""
    echo -e "${YELLOW}CORS Configuration:${NC}"
    local cors_origin=$(prompt_input "CORS Origin" "http://localhost:19006,http://localhost:8081")

    echo ""
    echo -e "${YELLOW}Logging Configuration:${NC}"
    local log_level=$(prompt_input "Log Level (debug/info/warn/error)" "debug")

    # Write .env file
    cat > "$env_file" << EOF
NODE_ENV=$node_env
PORT=$port
API_VERSION=$api_version

# Database
DATABASE_URL=$db_url

# JWT
JWT_SECRET=$jwt_secret
JWT_EXPIRES_IN=$jwt_expires

# Vapi
VAPI_API_KEY=$vapi_key
VAPI_WEBHOOK_SECRET=$vapi_secret

# Pipedream
PIPEDREAM_WEBHOOK_URL=$pipedream_url

# CORS
CORS_ORIGIN=$cors_origin

# Logging
LOG_LEVEL=$log_level
EOF

    print_success "Backend .env created at $env_file"
    return 0
}

# Function to setup mobile .env
setup_mobile_env() {
    print_header "Mobile Environment Configuration"

    local mobile_dir="$SCRIPT_DIR/mobile"
    local env_file="$mobile_dir/.env"
    local example_file="$mobile_dir/.env.example"

    # Check if .env.example exists
    if [ ! -f "$example_file" ]; then
        print_error ".env.example not found at $example_file"
        return 1
    fi

    echo "Configuring mobile environment variables..."
    echo ""

    echo -e "${YELLOW}API Configuration:${NC}"
    local api_url=$(prompt_input "API URL" "http://localhost:3000/api/v1" "validate_api_url")

    echo ""
    echo -e "${YELLOW}Vapi Configuration:${NC}"
    local vapi_public_key=$(prompt_input "Vapi Public Key" "YOUR_VAPI_PUBLIC_KEY_HERE")
    local vapi_assistant_id=$(prompt_input "Vapi Assistant ID" "YOUR_ASSISTANT_ID_HERE")

    echo ""
    echo -e "${YELLOW}App Configuration:${NC}"
    local app_name=$(prompt_input "App Name" "Echo-AI")
    local app_version=$(prompt_input "App Version" "1.0.0")

    # Write .env file
    cat > "$env_file" << EOF
EXPO_PUBLIC_API_URL=$api_url
EXPO_PUBLIC_VAPI_PUBLIC_KEY=$vapi_public_key
EXPO_PUBLIC_VAPI_ASSISTANT_ID=$vapi_assistant_id
EXPO_PUBLIC_APP_NAME=$app_name
EXPO_PUBLIC_APP_VERSION=$app_version
EOF

    print_success "Mobile .env created at $env_file"
    return 0
}

# Main execution
main() {
    print_header "Echo-AI Setup - Environment Configuration"

    echo ""
    echo "This script will guide you through setting up environment variables"
    echo "for both the backend and mobile applications."
    echo ""

    # Ask user which parts to configure
    echo "What would you like to configure?"
    echo "1) Both (Backend + Mobile)"
    echo "2) Backend only"
    echo "3) Mobile only"
    echo -n "Select option (1-3) [1]: "
    read choice
    choice=${choice:-1}

    case $choice in
        1)
            setup_backend_env && echo ""
            setup_mobile_env && echo ""
            ;;
        2)
            setup_backend_env && echo ""
            ;;
        3)
            setup_mobile_env && echo ""
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac

    echo ""
    print_header "Setup Complete"
    echo ""
    print_success "Environment files have been configured!"
    echo ""
    echo "Next steps:"
    echo "1. Review the created .env files for any adjustments"
    echo "2. Ensure your PostgreSQL database is running"
    echo "3. Run: ./quick-start.sh"
    echo ""
}

main "$@"
