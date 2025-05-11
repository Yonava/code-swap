#!/bin/bash

# run chmod +x setup-env.sh

SOURCE_ENV_FILE=".env"

if [ ! -f "$SOURCE_ENV_FILE" ]; then
  echo "hey there 👋! cannot seem to find $SOURCE_ENV_FILE in the root 😕"
  exit 1
fi

TARGET_DIRS=(
  "./packages/socket-gateway"
  "./packages/match-making"
  "./packages/game-management"
  "./packages/scoring"
)

for dir in "${TARGET_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    cp "$SOURCE_ENV_FILE" "$dir/.env"
    echo "Copied .env to $dir"
  else
    echo "Directory $dir does not exist"
  fi
done
