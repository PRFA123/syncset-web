#!/usr/bin/env bash
# Stop hook: block turn completion if the Astro build is broken.

cd "$CLAUDE_PROJECT_DIR" || exit 1

BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
  echo "$BUILD_OUTPUT" >&2
  echo "" >&2
  echo "npm run build failed (exit code $BUILD_STATUS). Fix the errors above before ending the turn." >&2
  exit 2
fi

exit 0
