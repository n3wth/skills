#!/bin/bash
# newth.ai skills installer
# Usage: curl -fsSL https://skills.newth.ai/install.sh | bash [-s -- gemini|claude]

set -e

SKILLS_REPO="https://github.com/n3wth/newth-skills.git"
SKILLS_DIR="$HOME/.skills"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}╭─────────────────────────────────────╮${NC}"
    echo -e "${BLUE}│${NC}    ${GREEN}newth.ai skills installer${NC}        ${BLUE}│${NC}"
    echo -e "${BLUE}╰─────────────────────────────────────╯${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}→${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Detect platform
detect_platform() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*)  echo "linux" ;;
        *)       echo "unknown" ;;
    esac
}

# Get skills source directory
get_skills_source() {
    # Check common locations
    if [ -d "$HOME/.claude/skills" ]; then
        echo "$HOME/.claude/skills"
    elif [ -d "$HOME/.gemini/skills" ]; then
        echo "$HOME/.gemini/skills"
    else
        echo ""
    fi
}

# Install for Gemini CLI
install_gemini() {
    print_info "Installing skills for Gemini CLI..."

    GEMINI_DIR="$HOME/.gemini"
    GEMINI_SKILLS="$GEMINI_DIR/skills"

    # Create directory if needed
    mkdir -p "$GEMINI_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$GEMINI_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -d "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$GEMINI_SKILLS/$name" ]; then
                    ln -s "$skill" "$GEMINI_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$GEMINI_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    # Update GEMINI.md if it exists
    if [ -f "$GEMINI_DIR/GEMINI.md" ]; then
        print_success "Gemini CLI configuration found"
    else
        print_warning "Create $GEMINI_DIR/GEMINI.md to configure skills"
    fi

    print_success "Gemini CLI skills installed to $GEMINI_SKILLS"
}

# Install for Claude Code
install_claude() {
    print_info "Installing skills for Claude Code..."

    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_SKILLS="$CLAUDE_DIR/skills"

    # Create directory if needed
    mkdir -p "$CLAUDE_SKILLS"

    # Check if source skills exist
    SOURCE=$(get_skills_source)

    if [ -n "$SOURCE" ] && [ "$SOURCE" != "$CLAUDE_SKILLS" ]; then
        print_info "Linking skills from $SOURCE"

        for skill in "$SOURCE"/*; do
            if [ -d "$skill" ]; then
                name=$(basename "$skill")
                if [ ! -e "$CLAUDE_SKILLS/$name" ]; then
                    ln -s "$skill" "$CLAUDE_SKILLS/$name"
                    print_success "Linked $name"
                else
                    print_warning "$name already exists, skipping"
                fi
            fi
        done
    else
        print_info "Downloading skills from repository..."

        # Clone to temp and copy skills
        TMP_DIR=$(mktemp -d)
        git clone --depth 1 "$SKILLS_REPO" "$TMP_DIR" 2>/dev/null || {
            print_error "Failed to clone skills repository"
            rm -rf "$TMP_DIR"
            exit 1
        }

        if [ -d "$TMP_DIR/skills" ]; then
            cp -r "$TMP_DIR/skills/"* "$CLAUDE_SKILLS/" 2>/dev/null || true
        fi

        rm -rf "$TMP_DIR"
    fi

    # Check for settings.json
    if [ -f "$CLAUDE_DIR/settings.json" ]; then
        print_success "Claude Code configuration found"
    else
        print_warning "Create $CLAUDE_DIR/settings.json to configure skills"
    fi

    print_success "Claude Code skills installed to $CLAUDE_SKILLS"
}

# Main
print_header

PLATFORM=$(detect_platform)
print_info "Detected platform: $PLATFORM"

TARGET="${1:-all}"

case "$TARGET" in
    gemini)
        install_gemini
        ;;
    claude)
        install_claude
        ;;
    all|*)
        install_gemini
        echo ""
        install_claude
        ;;
esac

echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Restart your AI assistant"
echo "  2. Try using a skill: /pdf, /xlsx, /gsap-animations"
echo ""
echo -e "Learn more at ${BLUE}https://skills.newth.ai${NC}"
echo ""
