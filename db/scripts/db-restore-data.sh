#!/bin/bash

# Database credentials
DATABASE=$POSTGRES_DB
USER=$POSTGRES_USER
HOST=$POSTGRES_HOST
PASSWORD=$POSTGRES_PASSWORD
PORT=$POSTGRES_PORT

# Export password to avoid password prompt
export PGPASSWORD=$PASSWORD

# Function to copy data from backup to public
restore_table() {
    local table_name=$1
    echo "Restoring $table_name..."
    psql -h $HOST -p $PORT -U $USER -d $DATABASE -c \
    "INSERT INTO public.$table_name (SELECT * FROM backup.$table_name) ON CONFLICT DO NOTHING;" 
}

# Connect to the database and fetch all table names from the public schema
tables=$(psql -h $HOST -p $PORT -U $USER -d $DATABASE -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")

# Truncate each table in the backup schema first
for table in $tables; do
    truncate_table $table
done

# Loop through the tables and back them up
for table in $tables; do
    restore_table $table
done

echo "Restore completed."

# Unset the password for security reasons
unset PGPASSWORD