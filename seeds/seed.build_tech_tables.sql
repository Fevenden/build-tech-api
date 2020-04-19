BEGIN;

TRUNCATE 
    builds,
    users
    restart IDENTITY CASCADE;

INSERT INTO users (full_name, username, user_password, email)
VALUES
  ('Freedom Evenden', 'Yeet', 'password', 'example@email.com');

INSERT INTO builds (user_id, stats, perks)
VALUES
  (
    1, 
    ARRAY['{"title": "strength", "value": 1}', '{"title": "perception", "value": 1}', '{"title": "endurance", "value": 1}', '{"title": "charisma", "value": 1}', '{"title": "intelligence", "value": 1}', '{"title": "agility", "value": 1}', '{"title": "luck", "value": 1}']::json[],
    ARRAY['{"stat": "strength", "perks":'{"title": "perk 1"}', '{"title": "perk 2"}', '{"stat": "perception", "perks": '{"title": "perk 1"}', '{"title": "perk 2"}'}']::json[]
  );

COMMIT;