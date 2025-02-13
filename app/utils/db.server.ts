// app/utils/db.server.ts

import type { Client as PGClientType } from "pg";
import pkg from "pg";

const { Client } = pkg;

const client: PGClientType = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect().catch((err) => {
  console.error("Failed to connect to Postgres:", err);
});

export { client };
