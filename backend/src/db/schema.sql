CREATE TABLE IF NOT EXISTS todos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
    date       TEXT    NOT NULL,
    completed  INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_todos_date ON todos(date);
