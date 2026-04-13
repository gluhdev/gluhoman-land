#!/bin/sh
# Daily pg_dump backup for Глухомань Postgres.
# Runs inside the `backup` profile container of docker-compose.prod.yml,
# or directly on the host when PGHOST/PGUSER/PGPASSWORD/PGDATABASE are set.
set -e

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=${BACKUP_DIR:-/backups}
mkdir -p "$BACKUP_DIR"

pg_dump -Fc -f "$BACKUP_DIR/gluhoman-$TIMESTAMP.dump"

# Retention: keep last 7 days of dumps.
find "$BACKUP_DIR" -name 'gluhoman-*.dump' -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/gluhoman-$TIMESTAMP.dump"
