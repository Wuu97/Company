# Logistics TMS V1

## Local setup
1. `cp .env.example .env`
2. `docker compose up -d`
3. `npm install`
4. `npm run db:generate && npm run db:migrate`
5. `npm run dev`

Original SO files are stored behind a storage interface; local development uses `FILE_STORAGE_ROOT`. Back up PostgreSQL plus this directory together. Never commit `.env` or production files.

The project database is exposed at `127.0.0.1:5433` to avoid colliding with a locally installed PostgreSQL on port 5432.
