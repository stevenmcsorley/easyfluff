// app/session.server.ts

import { createCookieSessionStorage } from "@remix-run/node";

// Make sure to set SESSION_SECRET in your .env file
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
