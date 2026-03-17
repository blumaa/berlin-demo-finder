ALTER TABLE demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE geocode_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON demos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON geocode_cache FOR SELECT USING (true);
