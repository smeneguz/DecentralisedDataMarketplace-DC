-- Crea un nuovo database
CREATE DATABASE datacellar;

-- Crea un nuovo utente e assegna tutti i diritti al database
CREATE USER dcuser WITH PASSWORD 'datacellar';
ALTER ROLE dcuser SET client_encoding TO 'utf8';
ALTER ROLE dcuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE dcuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE datacellar TO dcuser;

-- Connetti al database appena creato
\c datacellar;

-- Crea uno schema personalizzato
CREATE SCHEMA datacellar_schema;

-- Imposta "dcuser" come proprietario dello schema
ALTER SCHEMA datacellar_schema OWNER TO dcuser;

-- Crea una tabella nel database
CREATE TABLE datacellar_schema.users (
    id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    privateKey VARCHAR(255) NOT NULL
);

-- Assegna diritti all'utente "dcuser" sulla tabella "users"
GRANT ALL PRIVILEGES ON TABLE datacellar_schema.users TO dcuser;