#!/bin/bash

# Database credentials
DATABASE=$POSTGRES_DB
USER=$POSTGRES_USER
HOST=$POSTGRES_HOST
PASSWORD=$POSTGRES_PASSWORD
PORT=$POSTGRES_PORT

# Export password to avoid password prompt
export PGPASSWORD=$PASSWORD

# Function to copy data from public to backup
backup_table() {
    local table_name=$1
    echo "Backing up $table_name..."
    psql -h $HOST -p $PORT -U $USER -d $DATABASE -c \
    "DELETE FROM backup.$table_name; INSERT INTO backup.$table_name (SELECT * FROM public.$table_name);"
}

# Connect to the database and fetch all table names from the public schema
tables=$(psql -h $HOST -p $PORT -U $USER -d $DATABASE -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")

# Loop through the tables and back them up
for table in $tables; do
    backup_table $table
done

echo "Backup completed."

# Unset the password for security reasons
unset PGPASSWORD
