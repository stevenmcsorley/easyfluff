// app/routes/auth/register.tsx

import { Form, Link, useActionData } from "@remix-run/react";
import { createUser, getUserByEmail } from "../models/user.server";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role"); // "customer" or "driver"

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string"
  ) {
    return json({ error: "Invalid form submission" }, { status: 400 });
  }

  // Check if the user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      { error: "A user with that email already exists." },
      { status: 400 }
    );
  }

  // Create the user
  await createUser(email, password, role);

  // TODO: Set up session and login the user.
  return redirect("/dashboard");
};

export default function Register() {
  const actionData = useActionData();
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {actionData?.error && (
        <p className="mb-4 text-red-600">{actionData.error}</p>
      )}
      <Form method="post" data-turbo="false" className="space-y-4">
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
        <div>
          <label htmlFor="role" className="label">
            Role
          </label>
          <select
            name="role"
            id="role"
            className="select select-bordered w-full"
            required
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </Form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="link">
          Login
        </Link>
      </p>
    </div>
  );
}
