CREATE TABLE builds (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stats JSON [],
  perks JSON []
)

