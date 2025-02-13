// app/utils/db.server.ts

// 1) Import the type for 'Client' from 'pg'

import type { Client as PGClientType } from "pg";
import pkg from "pg";

// 2) Import the actual runtime module as a default import (CommonJS).
const { Client } = pkg;

/* eslint-disable no-var */
declare global {
  // We store a typed reference to the client in dev for hot reloads
  var __dbClient: PGClientType | undefined;
}
/* eslint-enable no-var */

// Attempt to reuse the existing global client or create a new one
const client =
  global.__dbClient ??
  (new Client({
    connectionString: process.env.DATABASE_URL,
  }) as PGClientType);

if (!global.__dbClient) {
  // Connect the first time
  client.connect().catch((err) => {
    console.error("Failed to connect to Postgres:", err);
  });
  // Cache for dev/hot reload
  global.__dbClient = client;
}

export { client };
