// app/routes/pickups.tsx

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Ensure the user is logged in
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  // Optionally, fetch additional user info if needed.
  return json({ userId });
};

export const action: ActionFunction = async ({ request }) => {
  // Ensure the user is logged in
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  const formData = await request.formData();
  const pickupTime = formData.get("pickupTime");
  const pickupAddress = formData.get("pickupAddress");

  if (typeof pickupTime !== "string" || typeof pickupAddress !== "string") {
    return json({ error: "Invalid pickup details." }, { status: 400 });
  }

  // Insert a new order with the scheduled pickup information.
  // You can set additional fields as needed (e.g. status, scheduled_delivery, etc.).
  await client.query(
    `INSERT INTO orders (user_id, scheduled_pickup, pickup_address, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'Scheduled', NOW(), NOW())`,
    [userId, pickupTime, pickupAddress]
  );

  return redirect("/dashboard");
};

export default function SchedulePickup() {
  const { userId } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Schedule Pickup</h2>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="pickupAddress" className="label">
            Pickup Address
          </label>
          <input
            type="text"
            name="pickupAddress"
            id="pickupAddress"
            className="input input-bordered w-full"
            placeholder="Enter your pickup address"
            required
          />
        </div>
        <div>
          <label htmlFor="pickupTime" className="label">
            Pickup Time
          </label>
          <input
            type="datetime-local"
            name="pickupTime"
            id="pickupTime"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting"
            ? "Scheduling..."
            : "Schedule Pickup"}
        </button>
      </Form>
    </div>
  );
}
