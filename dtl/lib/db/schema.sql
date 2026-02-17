-- Idempotent schema for DTL. Run once per database (local or Vercel Postgres).

-- Settings (single row each, id = 1)
CREATE TABLE IF NOT EXISTS feature_flags (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS business_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS contact_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS working_hours (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'
);

-- Entities
CREATE TABLE IF NOT EXISTS clients (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  car text,
  programari_count int NOT NULL DEFAULT 0,
  last_visit text
);

CREATE TABLE IF NOT EXISTS appointments (
  id text PRIMARY KEY,
  nume text NOT NULL,
  telefon text NOT NULL DEFAULT '',
  email text NOT NULL,
  data text NOT NULL,
  ora text NOT NULL,
  marca text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  tip text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'În așteptare',
  descriere text,
  client_notes text
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id text PRIMARY KEY,
  created_at text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  car_make text NOT NULL DEFAULT '',
  car_model text NOT NULL DEFAULT '',
  car_year text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  chassis text,
  photo_url text,
  status text NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  can_manage_users boolean DEFAULT false,
  password_hash text,
  last_login text
);

CREATE TABLE IF NOT EXISTS client_cars (
  id text PRIMARY KEY,
  client_id text NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  car_make text NOT NULL,
  car_model text NOT NULL,
  car_year text NOT NULL,
  chassis text
);

CREATE TABLE IF NOT EXISTS plati (
  id text PRIMARY KEY,
  client_id text NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  nr_factura text NOT NULL,
  data text NOT NULL,
  suma text NOT NULL,
  descriere text NOT NULL,
  notes text
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id text PRIMARY KEY,
  title text NOT NULL,
  caption text,
  image_url text NOT NULL,
  "order" int NOT NULL DEFAULT 0,
  created_at text NOT NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id text PRIMARY KEY,
  author text NOT NULL,
  role text,
  content text NOT NULL,
  rating int,
  created_at text NOT NULL,
  visible boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS invitations (
  token text PRIMARY KEY,
  user_id text NOT NULL,
  email text NOT NULL,
  expires_at bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS push_tokens (
  id serial PRIMARY KEY,
  role text NOT NULL,
  ref text,
  token text NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  category text NOT NULL CHECK (category IN ('general', 'anvelope', 'spalatorie')),
  name text NOT NULL,
  price text NOT NULL,
  "order" int NOT NULL DEFAULT 0
);

-- Ensure single row for settings
INSERT INTO feature_flags (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;
INSERT INTO business_settings (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;
INSERT INTO contact_settings (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;
INSERT INTO working_hours (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;

-- Seed default services (same as original frontend list); safe to re-run (ON CONFLICT skip)
INSERT INTO services (id, category, name, price, "order") VALUES
  ('srv-seed-general-1', 'general', 'Revizie periodică (Ulei + Filtre)', 'de la 450 RON', 0),
  ('srv-seed-general-2', 'general', 'Sistem de frânare (Plăcuțe/Discuri)', 'de la 150 RON', 1),
  ('srv-seed-general-3', 'general', 'Diagnoză computerizată', 'de la 100 RON', 2),
  ('srv-seed-anvelope-1', 'anvelope', 'Schimb anvelope (set 4)', 'de la 160 RON', 0),
  ('srv-seed-anvelope-2', 'anvelope', 'Echilibrare roți', 'de la 60 RON', 1),
  ('srv-seed-anvelope-3', 'anvelope', 'Geometrie roți 3D', 'de la 150 RON', 2),
  ('srv-seed-spalatorie-1', 'spalatorie', 'Spălare exterior + interior', 'de la 60 RON', 0),
  ('srv-seed-spalatorie-2', 'spalatorie', 'Ceară lichidă profesională', '30 RON', 1),
  ('srv-seed-spalatorie-3', 'spalatorie', 'Cosmetizare interior completă', 'de la 450 RON', 2)
ON CONFLICT (id) DO NOTHING;
