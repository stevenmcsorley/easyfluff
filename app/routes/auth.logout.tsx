// app/routes/auth/logout.tsx

import { destroySession, getSession } from "~/session.server";

import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Logout() {
  // This route doesn't need to render anything because it immediately logs the user out.
  return null;
}
