DROP TABLE IF EXISTS movieslibrary;
CREATE TABLE IF NOT EXISTS movieslibrary(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(100),
    overview VARCHAR(255),
    poster_path VARCHAR(255)
)