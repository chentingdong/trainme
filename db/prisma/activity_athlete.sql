ALTER TABLE activity ADD COLUMN athlete_id FLOAT;
UPDATE activity SET "athlete_id" = athlete->>'id' WHERE athlete_id IS NULL;
ALTER TABLE activity DROP COLUMN athlete;


-- made a mistake in the type, it should be a float
ALTER TABLE activity ALTER COLUMN athlete_id TYPE FLOAT USING athlete_id::float;
