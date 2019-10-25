BEGIN;

CREATE TABLE carriers(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    company_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    mc_num TEXT NOT NULL UNIQUE
);

CREATE TYPE active_status AS ENUM(
    'active',
    'inactive'
);

CREATE TABLE equipments(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    unit_num TEXT NOT NULL,
    carrier_id INTEGER REFERENCES carriers(id) ON DELETE CASCADE,
    status active_status DEFAULT 'active' NOT NULL
);

CREATE TABLE drivers(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    full_name TEXT NOT NULL,
    pay_rate NUMERIC(5,2) DEFAULT 0.00 NOT NULL,
    equipment_id INTEGER REFERENCES equipments(id) ON DELETE SET NULL UNIQUE,
    carrier_id INTEGER REFERENCES carriers(id) ON DELETE CASCADE,
    status active_status DEFAULT 'active' NOT NULL
);

CREATE TABLE warehouses(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    zipcode TEXT NOT NULL
);

CREATE TYPE shipment_status AS ENUM(
    'Un-Assigned',
    'Dispatched',
    'Loading',
    'In Transit',
    'Unloading',
    'Completed'
);

CREATE TABLE shipments(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    rate NUMERIC(7,2) DEFAULT 0.00 NOT NULL,
    status shipment_status DEFAULT 'Un-Assigned' NOT NULL,
    miles NUMERIC(5,0) DEFAULT 0 NOT NULL,
    broker TEXT,
    diver_id INTEGER REFERENCES drivers(id),
    pickup_date DATE NOT NULL DEFAULT NOW(),
    pickup_warehouse INTEGER REFERENCES warehouses(id) NOT NULL,
    delivery_date DATE NOT NULL DEFAULT NOW(),
    delivery_city INTEGER REFERENCES warehouses(id) NOT NULL
);

COMMIT;
