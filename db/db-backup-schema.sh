#!/bin/bash

# This script exports the public schema to a backup schema in the same database. Populate the data too.

DATABASE=$POSTGRES_DB
USER=$POSTGRES_USER
HOST=$POSTGRES_HOST
PASSWORD=$POSTGRES_PASSWORD
PORT=$POSTGRES_PORT

# Export password to avoid the password prompt
export PGPASSWORD=$PASSWORD

echo "Creating backup schema and copying tables..."
psql -h $HOST -p $PORT -U $USER -d $DATABASE -f - <<EOF
CREATE SCHEMA IF NOT EXISTS backup;
DO \$\$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    BEGIN
      EXECUTE 'CREATE TABLE backup.' || quote_ident(table_name) || ' AS TABLE public.' || quote_ident(table_name);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to copy table %: %', table_name, SQLERRM;
    END;
  END LOOP;
END \$\$;
EOF

echo "Backup completed."