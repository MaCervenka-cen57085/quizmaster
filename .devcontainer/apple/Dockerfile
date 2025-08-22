# ------------------------------------------------------------
# Quizmaster unified devcontainer (Apple Silicon friendly)
#
# This image is designed to run the ENTIRE dev workflow inside a
# single container on macOS (Apple Silicon / arm64) as well as x64.
#
# It installs:
# - Git and common tooling
# - OpenJDK 21 (for Spring Boot + Gradle)
# - Node.js 22 + pnpm (for the React/Vite frontend and tooling)
# - PostgreSQL 16 server (for the backend DB)
# - Playwright system dependencies (for E2E tests)
#
# The container uses the devcontainers base image which is multi-arch
# and supports both arm64 and amd64 out-of-the-box.
# ------------------------------------------------------------

FROM mcr.microsoft.com/devcontainers/java:1-21-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Etc/UTC

# ------------------------------
# System packages and utilities
# ------------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        software-properties-common \
        git \
        openssh-client \
        sudo \
        locales \
    && rm -rf /var/lib/apt/lists/*

# Ensure passwordless sudo for user 'vscode' (avoid prompts inside the container)
RUN groupadd -f sudo \
    && if id -u vscode >/dev/null 2>&1; then usermod -aG sudo vscode; fi \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/010-vscode-nopasswd \
    && chmod 0440 /etc/sudoers.d/010-vscode-nopasswd

# ------------------------------
# Java 21 is preinstalled in the base image above
# ------------------------------

# ------------------------------
# Node.js 22 + pnpm
# ------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && corepack disable || true \
    && npm i -g pnpm@10.14.0

# ------------------------------
# PostgreSQL 16 server + client
# ------------------------------
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends postgresql-16 postgresql-client-16 \
    && rm -rf /var/lib/apt/lists/*

# Default Postgres env (overridable)
ENV POSTGRES_VERSION=16 \
    PGDATA=/var/lib/postgresql/data \
    DB_NAME=quizmaster \
    DB_USER=quizmaster \
    DB_PASS=quizmaster

# Create a volume mount point for persistent DB storage
VOLUME ["/var/lib/postgresql/data"]

# ------------------------------
# Playwright OS dependencies
# ------------------------------
# We install the OS deps during build to avoid requiring sudo later.
# Browsers are downloaded on first project install.
RUN npx -y @playwright/test@1.49.0 install-deps

# ------------------------------
# Helpers and services script
# ------------------------------
COPY .devcontainer/services.sh /usr/local/bin/services.sh
RUN chmod +x /usr/local/bin/services.sh \
    && chown root:root /usr/local/bin/services.sh

# Useful default ports for the workspace
EXPOSE 5432 8080 5173 3333

# Do not set an ENTRYPOINT/CMD – the Dev Containers extension controls lifecycle.


