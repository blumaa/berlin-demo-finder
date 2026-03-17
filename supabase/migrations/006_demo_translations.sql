CREATE TABLE demo_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id uuid NOT NULL REFERENCES demos(id) ON DELETE CASCADE,
  locale text NOT NULL,
  topic text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(demo_id, locale)
);

CREATE INDEX idx_demo_translations_demo_id ON demo_translations(demo_id);
CREATE INDEX idx_demo_translations_locale ON demo_translations(locale);
