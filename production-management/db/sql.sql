/*
const pool = new Pool({
    user: "postgres",
    password: 'Originrega',
    host: 'localhost',
    port: 5432,
    database: 'production-management-db',
    encoding: 'UTF8'
})
*/
/*
const pool = new Pool({
    user: "postgres",
    password: 'Originrega',
    host: 'localhost',
    port: 5432,
    database: 'production-management-db',
    encoding: 'UTF8'
})
*/

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR
);

INSERT INTO roles(name) VALUES ('Администратор');
INSERT INTO roles(name) VALUES ('Отдел производства')


CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
	name VARCHAR,
	adress VARCHAR,
	INN VARCHAR,
	KPP VARCHAR
);

CREATE TABLE details (
    id SERIAL PRIMARY KEY,
	name VARCHAR,
	unit VARCHAR,
	supplied INTEGER,
	written_off INTEGER DEFAULT 0,
	balance INTEGER,
	supply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UPD_SF_number VARCHAR,
	supplier_name VARCHAR,
	supplier_INN_KPP VARCHAR,
	price DECIMAL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    name VARCHAR,
    email VARCHAR,
    hash VARCHAR,
    role INTEGER REFERENCES roles(id)
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operation VARCHAR
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
	name VARCHAR,
    produced INTEGER DEFAULT 0,
    shipped INTEGER DEFAULT 0,
    ready_to_ship INTEGER DEFAULT 0,
	description VARCHAR
);

CREATE TABLE compatibilities (
	detail_id INTEGER REFERENCES details(id),
    product_id INTEGER REFERENCES products(id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
	client_id INTEGER REFERENCES agents(id),
	is_commercial_secret BOOLEAN DEFAULT FALSE,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deadline TIMESTAMP,
	doc_number VARCHAR,
    shipping_status BOOLEAN DEFAULT FALSE,
    requirements VARCHAR
);

CREATE TABLE orders_products (
    order_id INTEGER REFERENCES orders(id),
	product_id INTEGER REFERENCES products(id),
	quantity INTEGER,
	is_ready_to_ship BOOLEAN
);

CREATE TABLE products_productions (
	product_id INTEGER REFERENCES products(id),
	production_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	quantity INTEGER
);

CREATE TABLE products_shipping (
	product_id INTEGER REFERENCES details(id),
	order_id INTEGER REFERENCES orders(id),
	shipping_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	quantity INTEGER
);

CREATE TABLE details_write_offs (
	detail_id INTEGER REFERENCES details(id),
	write_off_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	quantity INTEGER
);

CREATE TABLE logs_users (
	log_id INTEGER REFERENCES logs(id),
	user_id INTEGER REFERENCES users(id)
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_data BYTEA NOT NULL
);         