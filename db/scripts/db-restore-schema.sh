#!/bin/bash

# This script exports the backup schema to a public schema in the same database. Populate the data too.

DATABASE=$POSTGRES_DB
USER=$POSTGRES_USER
HOST=$POSTGRES_HOST
PASSWORD=$POSTGRES_PASSWORD
PORT=$POSTGRES_PORT

# Export password to avoid the password prompt
export PGPASSWORD=$PASSWORD

echo "Creating public schema and copying tables..."
psql -h $HOST -p $PORT -U $USER -d $DATABASE -f - <<EOF
CREATE SCHEMA IF NOT EXISTS public;
DO \$\$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'backup'
  LOOP
    BEGIN
      EXECUTE 'CREATE TABLE public.' || quote_ident(table_name) || ' AS TABLE backup.' || quote_ident(table_name);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Failed to copy table %: %', table_name, SQLERRM;
    END;
  END LOOP;
END \$\$;
EOF

echo "Restore completed."