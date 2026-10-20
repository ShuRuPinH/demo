# Notes Demo (Docker Compose + Caddy + PostgreSQL)

Небольшое демо: веб-форма для просмотра и добавления записей в PostgreSQL.
Трафик идёт через Caddy, приложение на Node.js/Express.

## Запуск

```bash
docker compose up --build
```

Откройте http://localhost:8888

## Сервисы

| Сервис | Роль |
|--------|------|
| `caddy` | reverse proxy на порту `8888` |
| `app` | Express API + статический фронт |
| `db` | PostgreSQL 16 |

## API

- `GET /api/notes` — список записей
- `POST /api/notes` — создать запись `{ "title": "...", "body": "..." }`
- `GET /api/health` — проверка связи с БД

## Остановка

```bash
docker compose down
```

Данные Postgres хранятся в volume `pgdata`. Чтобы удалить и их:

```bash
docker compose down -v
```
