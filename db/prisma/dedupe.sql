DELETE FROM lap
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM lap
  GROUP BY "id", name
);

DELETE FROM sport_type
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM sport_type
  GROUP BY "id"
);

DELETE FROM activity
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM activity
  GROUP BY "id"
);



DELETE FROM "backup"."lap"
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM "backup"."lap"
  GROUP BY "id", name
);

DELETE FROM "backup"."sport_type"
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM "backup"."sport_type"
  GROUP BY "id"
);

DELETE FROM "public"."activity"
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM "public"."activity"
  GROUP BY "id"
);



