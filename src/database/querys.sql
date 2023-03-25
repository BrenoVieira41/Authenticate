CREATE TABLE users (
  id serial primary key,
  email VARCHAR not NULL,
  password VARCHAR not null,
  "isComplet" BOOLEAN default false
);

CREATE TABLE tokens (
  id serial primary key,
  token VARCHAR not NULL,
  "userId" INTEGER references users(id),
  "tokenValidate" TIMESTAMPTZ default now()
);
