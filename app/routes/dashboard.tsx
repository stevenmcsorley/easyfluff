// app/routes/dashboard.tsx

import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";
import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const role = session.get("role");

  if (!userId) {
    return redirect("/auth/login");
  }

  // Fetch user data from the database.
  const userResult = await client.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  const user = userResult.rows[0];

  // Fetch the user's active subscription details by joining user_subscriptions and subscriptions.
  const subResult = await client.query(
    `SELECT us.*, s.name, s.description, s.price, s.frequency
     FROM user_subscriptions AS us
     JOIN subscriptions AS s ON us.subscription_id = s.id
     WHERE us.user_id = $1 AND us.active = true`,
    [userId]
  );
  const subscription = subResult.rowCount > 0 ? subResult.rows[0] : null;

  return json({ user, role, subscription });
};

export default function Dashboard() {
  const { user, role, subscription } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>
      <div className="card bg-base-100 shadow-xl p-4 mb-6">
        <div className="card-body">
          <h3 className="card-title">
            Welcome, {user.first_name || user.email}!
          </h3>
          <p>Your role: {role}</p>
          {role === "driver" ? (
            <p>
              As a driver, you can view and accept orders, update your status,
              and track deliveries.
            </p>
          ) : (
            <>
              <p>
                As a customer, you can manage your subscriptions, schedule
                pickups, and view your order history.
              </p>
              {subscription ? (
                <div className="mt-4 p-4 border rounded">
                  <h4 className="text-xl font-bold">
                    Current Subscription: {subscription.name}
                  </h4>
                  <p>{subscription.description}</p>
                  <p className="mt-2 font-bold">
                    Price: ${subscription.price} per {subscription.frequency}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-red-600">
                  You have no active subscription. Please select a plan.
                </p>
              )}
            </>
          )}
          <div className="card-actions justify-end mt-4">
            <a href="/subscriptions" className="btn btn-outline">
              Manage Subscription
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <a href="/orders" className="btn btn-primary">
          View Order History
        </a>
      </div>
    </div>
  );
}
