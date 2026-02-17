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

-- Seed gallery (same images as frontend galerie page); safe to re-run
INSERT INTO gallery_items (id, title, caption, image_url, "order", created_at) VALUES
  ('gal-seed-1', 'Service interior', 'Zonă de așteptare și recepție.', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600', 1, '2025-01-15T10:00:00.000Z'),
  ('gal-seed-2', 'Anvelope', 'Montaj și echilibrare.', 'https://images.unsplash.com/photo-1675034743126-0f250a5fee51?q=80&w=600', 2, '2025-01-16T11:00:00.000Z'),
  ('gal-seed-3', 'Spălătorie auto', 'Spălare și detailing.', 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=600', 3, '2025-01-17T09:00:00.000Z'),
  ('gal-seed-4', 'Revizie', 'Echipament profesional.', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=600', 4, '2025-01-18T14:00:00.000Z'),
  ('gal-seed-5', 'Service auto', NULL, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600', 5, '2025-01-19T08:00:00.000Z'),
  ('gal-seed-6', 'Lift și echipament', NULL, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600', 6, '2025-01-20T10:00:00.000Z'),
  ('gal-seed-7', 'Detalii lucrări', NULL, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600', 7, '2025-01-21T12:00:00.000Z'),
  ('gal-seed-8', 'Echipa DTL', NULL, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600', 8, '2025-01-22T09:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- Seed testimonials (same as frontend testimoniale page); safe to re-run
INSERT INTO testimonials (id, author, role, content, rating, created_at, visible) VALUES
  ('test-seed-1', 'Maria P.', 'Clientă, VW Golf', 'Serviciu rapid și profesional. Am revenit de mai multe ori pentru revizie și anvelope. Recomand cu căldură.', 5, '2025-02-01T12:00:00.000Z', true),
  ('test-seed-2', 'Ion I.', 'Client, Dacia Duster', 'Prețuri corecte, echipă serioasă. Mi-au explicat tot ce trebuia făcut la mașină. Mulțumesc!', 5, '2025-02-05T10:00:00.000Z', true),
  ('test-seed-3', 'Elena M.', 'Clientă, BMW 320', 'Cel mai bun service din zonă. Programare ușoară, lucrări de calitate. Voi reveni sigur.', 5, '2025-02-08T14:00:00.000Z', true),
  ('test-seed-4', 'Andrei S.', 'Client, Skoda Octavia', 'Spălătoria lor e impecabilă. Și service-ul general la fel. Recomand DTL.', 5, '2025-02-10T09:00:00.000Z', true)
ON CONFLICT (id) DO NOTHING;
