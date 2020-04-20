CREATE TABLE stats (
    id  SERIAL PRIMARY KEY,
    build_id INTEGER 
        REFERENCES builds(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    stat_value INTEGER NOT NULL
)

