CREATE TABLE geocode_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address_key text UNIQUE NOT NULL,
  lat float8 NOT NULL,
  lng float8 NOT NULL,
  formatted_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
