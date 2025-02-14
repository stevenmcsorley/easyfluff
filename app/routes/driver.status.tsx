// app/routes/driver/status.tsx

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const role = session.get("role");

  if (!userId || role !== "driver") {
    return redirect("/auth/login");
  }

  // Fetch the driver's current status from the users table
  const result = await client.query(
    "SELECT driver_status, email FROM users WHERE id = $1",
    [userId]
  );
  const driver = result.rows[0];
  return json({ driver });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const role = session.get("role");

  if (!userId || role !== "driver") {
    return redirect("/auth/login");
  }

  const formData = await request.formData();
  const newStatus = formData.get("driverStatus");

  if (typeof newStatus !== "string") {
    return json({ error: "Invalid status" }, { status: 400 });
  }

  // Update the driver's status in the users table.
  // Ensure your users table includes a "driver_status" column.
  await client.query(
    "UPDATE users SET driver_status = $1, updated_at = NOW() WHERE id = $2",
    [newStatus, userId]
  );

  return redirect("/driver/status");
};

export default function DriverStatus() {
  const { driver } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Update Your Status
      </h2>
      <p className="mb-4">
        Current Status: {driver.driver_status || "Not set"}
      </p>
      <Form method="post">
        <select
          name="driverStatus"
          className="select select-bordered w-full mb-4"
          defaultValue={driver.driver_status || ""}
        >
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Offline">Offline</option>
        </select>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Updating..." : "Update Status"}
        </button>
      </Form>
    </div>
  );
}
