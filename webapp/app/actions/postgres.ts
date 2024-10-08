import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
});
