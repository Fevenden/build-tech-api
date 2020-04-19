CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL,
  user_password  TEXT NOT NULL,
  email TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ NOT NULL DEFAULT now()
)