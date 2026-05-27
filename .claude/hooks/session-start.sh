#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code on the web environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "=== RYKU-builder session start ==="
echo "Project: $PROJECT_DIR"

# Install npm dependencies if package.json exists
if [ -f "$PROJECT_DIR/package.json" ]; then
  echo "Installing npm dependencies..."
  cd "$PROJECT_DIR"
  npm install
  echo "npm install complete."
fi

# Verify key project files are present
REQUIRED_FILES=(
  "index.html"
  "build-planner.html"
  "css/main.css"
  "js/data.js"
  "js/main.js"
  "js/auth.js"
  "js/build-planner.js"
  "js/contest.js"
)

MISSING=0
for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$PROJECT_DIR/$f" ]; then
    echo "WARNING: Missing expected file: $f"
    MISSING=$((MISSING + 1))
  fi
done

if [ "$MISSING" -eq 0 ]; then
  echo "All required project files present."
fi

echo "=== Session ready ==="
