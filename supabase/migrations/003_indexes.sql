CREATE INDEX idx_demos_date ON demos(date);
CREATE INDEX idx_demos_plz ON demos(plz);
CREATE INDEX idx_demos_scraped_at ON demos(scraped_at);
CREATE INDEX idx_demos_date_time ON demos(date, time_from);
CREATE INDEX idx_demos_topic_tsv ON demos USING GIN(topic_tsv);
