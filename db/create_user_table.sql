CREATE TABLE if not exists users (
    user_id SERIAL PRIMARY KEY,
    user_firstname TEXT,
    user_lastname TEXT,
    user_email TEXT,
    user_display_name TEXT,
    user_auth_id TEXT
)