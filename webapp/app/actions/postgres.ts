import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "trainme",
  password: "docker",
  port: Number(process.env.POSTGRES_PORT) || 5432,
});
