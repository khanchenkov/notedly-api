CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    content TEXT,
    created DATE,
    updated DATE,
    user_id INT,
    FOREIGN KEY (user_id) references users (id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password: TEXT,
    avatar TEXT
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    note_id INT,
    FOREIGN KEY (note_id) references notes (id),
    user_id INT,
    FOREIGN KEY (user_id) references users (id)
);

