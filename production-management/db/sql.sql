CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR
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
    operation VARCHAR,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
	name VARCHAR,
    produced INTEGER DEFAULT 0,
    shipped INTEGER DEFAULT 0,
    readyToShip INTEGER DEFAULT 0
);

CREATE TABLE compatibilities (
	detail_id INTEGER REFERENCES details(id),
    product_id INTEGER REFERENCES products(id)
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

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
	name VARCHAR,
	adress VARCHAR,
	INN VARCHAR,
	KPP VARCHAR
);