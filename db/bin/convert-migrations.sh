#!/bin/bash

# Define paths
BIN_DIR="$(cd "$(dirname "$0")" && pwd)"
PRISMA_MIGRATIONS_DIR="$BIN_DIR/../prisma/migrations"
SUPABASE_MIGRATIONS_DIR="$BIN_DIR/../supabase/migrations"

mkdir -p "$SUPABASE_MIGRATIONS_DIR"
echo $SUPABASE_MIGRATIONS_DIR

# Function to convert Prisma migration files to Supabase format
convert_prisma_to_supabase() {
  for prisma_migration_dir in "$PRISMA_MIGRATIONS_DIR"/*/; do
    if [[ -d "$prisma_migration_dir" ]]; then
      migration_file="$prisma_migration_dir/migration.sql"
      if [[ -f "$migration_file" ]]; then
        migration_name=$(basename "$prisma_migration_dir")
        supabase_migration_file="$SUPABASE_MIGRATIONS_DIR/$migration_name.sql"
        cp "$migration_file" "$supabase_migration_file"
        echo "Converted $migration_file to $supabase_migration_file"
      fi
    fi
  done
}

# Run the conversion function
convert_prisma_to_supabase

echo "Migration conversion completed."
