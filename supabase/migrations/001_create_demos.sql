CREATE TABLE demos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time_from time NOT NULL,
  time_to time,
  topic text NOT NULL,
  plz text NOT NULL,
  location text NOT NULL,
  lat float8,
  lng float8,
  route_text text,
  route_json jsonb,
  topic_tsv tsvector GENERATED ALWAYS AS (to_tsvector('german', topic)) STORED,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(date, time_from, topic, plz)
);
