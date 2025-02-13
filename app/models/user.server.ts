// app/models/user.server.ts

import bcrypt from "bcrypt";
import { client } from "../utils/db.server";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string; // 'customer' or 'driver'
  created_at: Date;
  updated_at: Date;
}

export async function createUser(
  email: string,
  password: string,
  role: string
): Promise<User> {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await client.query(
    `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *`,
    [email, password_hash, role]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0] || null;
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid ? user : null;
}
