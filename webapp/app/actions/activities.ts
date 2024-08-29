'use server';

import { openDb, SQLiteDatabase } from '@/app/lib/db';

export type Activity = {
  id: number;
  name: string;
  description: string;
};

export async function getActivities(): Promise<Activity[]> {
  const db: SQLiteDatabase = await openDb();
  const activities: Activity[] = await db.all('SELECT * FROM files_view');
  return activities;
}