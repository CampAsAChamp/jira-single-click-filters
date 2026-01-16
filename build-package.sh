#!/bin/bash

# Build script for Chrome Web Store package
# This creates a clean ZIP file ready for upload

echo "🎯 Building Chrome Web Store package..."

# Get the version from manifest.json
VERSION=$(grep -o '"version": "[^"]*' manifest.json | grep -o '[^"]*$')
echo "📦 Version: $VERSION"

# Output filename
OUTPUT="jira-mutually-exclusive-quick-filters-v${VERSION}.zip"

# Remove old package if it exists
if [ -f "$OUTPUT" ]; then
    echo "🗑️  Removing old package: $OUTPUT"
    rm "$OUTPUT"
fi

# Create the ZIP file, excluding unnecessary files
echo "📦 Creating package: $OUTPUT"
zip -r "$OUTPUT" . \
    -x "*.git*" \
    -x "*.DS_Store" \
    -x "*node_modules*" \
    -x "*.zip" \
    -x "*.crx" \
    -x "*.pem" \
    -x "*CHROME_WEB_STORE_PUBLISHING_PLAN.md" \
    -x "*build-package.sh" \
    -x "*.swp" \
    -x "*.swo"

if [ $? -eq 0 ]; then
    echo "✅ Package created successfully: $OUTPUT"
    echo "📊 Package size:"
    ls -lh "$OUTPUT"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Test the extension one more time"
    echo "   2. Go to https://chrome.google.com/webstore/devconsole"
    echo "   3. Upload $OUTPUT"
    echo "   4. Fill in store listing information"
    echo "   5. Submit for review"
else
    echo "❌ Error creating package"
    exit 1
fi
