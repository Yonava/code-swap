#!/bin/bash

# run chmod +x kill-ports.sh

# locally running microservice ports
PORTS=(3000 3001 3002 3003 3004)

for PORT in "${PORTS[@]}"; do
  PID=$(lsof -ti tcp:$PORT)
  if [ -n "$PID" ]; then
    echo "Killing process on port $PORT (PID $PID)"
    kill -9 $PID
  else
    echo "No process running on port $PORT"
  fi
done

echo "All ports cleared out!"
