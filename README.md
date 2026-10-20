# Notes Demo (Docker Compose + Caddy + PostgreSQL)

Небольшое демо: веб-форма для просмотра и добавления записей в PostgreSQL.
Трафик идёт через Caddy, приложение на Node.js/Express.

## Запуск

```bash
cp .env.example .env   # при необходимости поменяйте HTTP_PORT
docker compose up --build -d
```

По умолчанию: http://localhost:18080

Если порт занят (как было с `8888`), задайте свободный в `.env`:

```bash
# .env
HTTP_PORT=18081
```

Проверить, чем занят порт:

```bash
ss -tlnp | grep -E ':(8888|18080)\b'
# или
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

## Сервисы

| Сервис | Роль |
|--------|------|
| `caddy` | reverse proxy на хост-порту `HTTP_PORT` (по умолчанию `18080`) |
| `app` | Express API + статический фронт |
| `db` | PostgreSQL 16 (порт наружу не публикуется) |

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
