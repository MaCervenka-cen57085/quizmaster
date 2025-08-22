#!/usr/bin/env bash
set -euo pipefail

echo "[DEBUG] Script started - checking version and logic"
echo "[DEBUG] Current script location: $0"
echo "[DEBUG] Script contents check:"

# ------------------------------------------------------------
# Start local services required by the workspace
# - PostgreSQL 16
# - Initialize quizmaster DB/user on first run
# ------------------------------------------------------------

export POSTGRES_VERSION=${POSTGRES_VERSION:-16}
export PGDATA=${PGDATA:-/var/lib/postgresql/data}
export DB_NAME=${DB_NAME:-quizmaster}
export DB_USER=${DB_USER:-quizmaster}
export DB_PASS=${DB_PASS:-quizmaster}
export PGBIN="/usr/lib/postgresql/$POSTGRES_VERSION/bin"

debug_postgres_state() {
  echo "[debug] Checking PostgreSQL state..."
  echo "[debug] PGDATA: $PGDATA"
  echo "[debug] PGBIN: $PGBIN"

  if [[ -d "$PGDATA" ]]; then
    echo "[debug] PGDATA directory exists"
    if [[ -s "$PGDATA/PG_VERSION" ]]; then
      echo "[debug] PG_VERSION exists: $(cat "$PGDATA/PG_VERSION")"
    else
      echo "[debug] PG_VERSION missing or empty"
    fi
    echo "[debug] Directory contents:"
    sudo ls -la "$PGDATA" | head -10
  else
    echo "[debug] PGDATA directory does not exist"
  fi
}

ensure_postgres_initialized() {
  echo "[DEBUG] Entering ensure_postgres_initialized function"

  # If PostgreSQL data directory already exists and contains valid data, skip initialization
  if [[ -s "$PGDATA/PG_VERSION" ]]; then
    echo "[DEBUG] PG_VERSION exists and is not empty, skipping initialization"
    echo "[services] PostgreSQL data directory already exists with version $(cat "$PGDATA/PG_VERSION"), skipping initialization"
    return 0
  fi

  echo "[DEBUG] PG_VERSION check failed, checking directory existence"

  # If directory exists but doesn't contain valid PostgreSQL data, clean up contents
  if [[ -d "$PGDATA" ]]; then
    echo "[DEBUG] Directory exists but PG_VERSION check failed, cleaning up contents..."
    echo "[services] PostgreSQL data directory exists but is invalid, cleaning up contents..."
    # Can't remove the directory itself (it's a volume mount), but can clean contents
    sudo find "$PGDATA" -mindepth 1 -delete 2>/dev/null || true
  fi

  echo "[DEBUG] About to initialize PostgreSQL"
  echo "[services] Initializing PostgreSQL data directory in $PGDATA"

  # Ensure proper ownership and permissions
  sudo chown postgres:postgres "$PGDATA"
  sudo chmod 0700 "$PGDATA"

  # Initialize PostgreSQL
  sudo -u postgres -H \
    "$PGBIN/initdb" -D "$PGDATA" >/dev/null
  echo "[services] PostgreSQL initialization completed"
}

start_postgres() {
  # Check if already running using full path
  if sudo -u postgres -H "$PGBIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
    echo "[services] PostgreSQL is already running"
    return 0
  fi

  echo "[services] Starting PostgreSQL $POSTGRES_VERSION"
  sudo -u postgres -H \
    "$PGBIN/pg_ctl" -D "$PGDATA" -o "-c listen_addresses='*'" -w start >/dev/null
}

create_db_and_user() {
  echo "[services] Ensuring database '$DB_NAME' and user '$DB_USER' exist"
  # Wait for server
  for i in {1..30}; do
    if sudo -u postgres -H psql -h localhost -p 5432 -U postgres -c 'select 1' >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  sudo -u postgres -H bash -lc "psql -h localhost -p 5432 -U postgres -tc \"SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'\" | grep -q 1 || createdb -h localhost -p 5432 -U postgres '$DB_NAME'"
  sudo -u postgres -H bash -lc "psql -h localhost -p 5432 -U postgres -tc \"SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'\" | grep -q 1 || psql -h localhost -p 5432 -U postgres -c \"CREATE USER $DB_USER WITH PASSWORD '$DB_PASS'\""
  sudo -u postgres -H psql -h localhost -p 5432 -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER"
  sudo -u postgres -H psql -h localhost -p 5432 -U postgres -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER"
}

main() {
  debug_postgres_state
  echo "[DEBUG] About to call ensure_postgres_initialized"
  ensure_postgres_initialized
  echo "[DEBUG] Finished ensure_postgres_initialized"
  start_postgres
  create_db_and_user
  echo "[services] All services started"
}

main "$@"
