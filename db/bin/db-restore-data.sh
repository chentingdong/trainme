#!/bin/bash

# Database credentials
DATABASE=$POSTGRES_DB
USER=$POSTGRES_USER
HOST=$POSTGRES_HOST
PASSWORD=$POSTGRES_PASSWORD
PORT=$POSTGRES_PORT

# Export password to avoid password prompt
export PGPASSWORD=$PASSWORD

# Function to truncate a table in public schema
truncate_table() {
    local table_name=$1
    echo "Truncating $table_name..."
    psql -h $HOST -p $PORT -U $USER -d $DATABASE -c \
    "TRUNCATE TABLE public.$table_name;"
}

# Function to copy data from backup to public
restore_table() {
    local table_name=$1
    echo "Restoring $table_name..."

    # Fetch column names and types from the public schema
    local public_columns=$(psql -h $HOST -p $PORT -U $USER -d $DATABASE -t -c \
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '$table_name';")

    # Fetch column names from the backup schema
    local backup_columns=$(psql -h $HOST -p $PORT -U $USER -d $DATABASE -t -c \
    "SELECT column_name FROM information_schema.columns WHERE table_schema = 'backup' AND table_name = '$table_name';")

    # Construct the column list and casting expressions
    local column_list=""
    local select_list=""

    while IFS='|' read -r column_name data_type; do
        # Trim whitespace
        column_name=$(echo $column_name | xargs)
        data_type=$(echo $data_type | xargs)

        # Check if the column exists in the backup schema
        if echo "$backup_columns" | grep -q "$column_name"; then
            # Add to column list
            column_list+="$column_name, "

            # Add to select list with casting
            select_list+="$column_name::$data_type, "
        fi
    done <<< "$public_columns"

    # Remove trailing commas
    column_list=${column_list%, }
    select_list=${select_list%, }

    # Execute the dynamic SQL
    psql -h $HOST -p $PORT -U $USER -d $DATABASE -c \
    "INSERT INTO public.$table_name ($column_list) SELECT $select_list FROM backup.$table_name ON CONFLICT DO NOTHING;"
}
# restore_table() {
#     local table_name=$1
#     echo "Restoring $table_name..."
#     psql -h $HOST -p $PORT -U $USER -d $DATABASE -c \
#     "INSERT INTO public.$table_name (SELECT * FROM backup.$table_name) ON CONFLICT DO NOTHING;" 
# }

# Connect to the database and fetch all table names from the public schema
tables=$(psql -h $HOST -p $PORT -U $USER -d $DATABASE -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")

# Truncate each table in the public schema first
for table in $tables; do
    truncate_table $table
done

# Loop through the tables and restore to public schema
for table in $tables; do
    restore_table $table
done

echo "Restore completed."

# Unset the password for security reasons
unset PGPASSWORD