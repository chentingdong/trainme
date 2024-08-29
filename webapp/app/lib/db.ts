// lib/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export type SQLiteDatabase = Database<sqlite3.Database, sqlite3.Statement>;

export async function openDb(): Promise<SQLiteDatabase> {
  return open({
    filename: './GarminData/DBs/garmin.db',
    driver: sqlite3.Database,
  });
}