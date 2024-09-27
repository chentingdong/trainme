// lib/db.ts
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export type SQLiteDatabase = Database<sqlite3.Database, sqlite3.Statement>;

export async function openDb(filename: string): Promise<SQLiteDatabase> {
  return open({
    filename: filename,
    driver: sqlite3.Database,
  });
}
