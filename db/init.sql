CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO notes (title, body) VALUES
    ('Добро пожаловать', 'Это демо-запись в PostgreSQL.'),
    ('Docker Compose', 'Сервисы: Caddy, app, Postgres.');
