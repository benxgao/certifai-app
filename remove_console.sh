#!/bin/bash

# Script to remove console statements from client-side code
# Exclude server-side API routes and keep essential error logging

# Client-side directories to process
CLIENT_DIRS="src/components src/context src/hooks src/utils src/lib"

# Process each directory
for dir in $CLIENT_DIRS; do
    if [ -d "$dir" ]; then
        echo "Processing directory: $dir"

        # Find all TypeScript/JavaScript files
        find $dir -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read file; do
            if [ -f "$file" ]; then
                echo "  Processing: $file"

                # Remove console.log statements
                sed -i '' '/console\.log(/d' "$file"

                # Remove console.warn statements
                sed -i '' '/console\.warn(/d' "$file"

                # Remove console.error statements from client components (but keep them in lib files that might be used server-side)
                if [[ "$file" == *"/components/"* ]] || [[ "$file" == *"/hooks/"* ]] || [[ "$file" == *"/context/"* ]]; then
                    sed -i '' '/console\.error(/d' "$file"
                fi

                # Remove console.info statements
                sed -i '' '/console\.info(/d' "$file"

                # Remove console.debug statements
                sed -i '' '/console\.debug(/d' "$file"
            fi
        done
    fi
done

# Also process main app components (but not API routes)
echo "Processing app components..."
find app -name "*.tsx" -not -path "*/api/*" | while read file; do
    if [ -f "$file" ]; then
        echo "  Processing: $file"
        sed -i '' '/console\.log(/d' "$file"
        sed -i '' '/console\.warn(/d' "$file"
        sed -i '' '/console\.error(/d' "$file"
        sed -i '' '/console\.info(/d' "$file"
        sed -i '' '/console\.debug(/d' "$file"
    fi
done

echo "Console statement removal completed!"
