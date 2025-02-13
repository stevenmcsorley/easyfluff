// app/routes/auth/login.tsx

import { Form, Link, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";
import { verifyLogin } from "~/models/user.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  // TODO: Set up session cookie to keep user logged in.
  return redirect("/dashboard");
};

export default function Login() {
  const actionData = useActionData();
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {actionData?.error && (
        <p className="mb-4 text-red-600">{actionData.error}</p>
      )}
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </Form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/auth/register" className="link">
          Register
        </Link>
      </p>
    </div>
  );
}
