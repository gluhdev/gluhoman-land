#!/bin/sh
# Restore Глухомань Postgres from a pg_dump custom-format archive.
# Requires DATABASE_URL to be exported in the environment.
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <backup-file.dump>"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set." >&2
  exit 1
fi

pg_restore --clean --if-exists -d "$DATABASE_URL" "$1"
echo "Restore completed from $1"
