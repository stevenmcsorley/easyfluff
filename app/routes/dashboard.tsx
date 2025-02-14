// app/routes/dashboard.tsx

import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";
import { getSession } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const role = session.get("role");

  if (!userId) {
    // Redirect to login if not logged in
    return redirect("/auth/login");
  }

  return json({ userId, role });
};

export default function Dashboard() {
  const { userId, role } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>
      <div className="card bg-base-100 shadow-xl p-4 mb-6">
        <div className="card-body">
          <h3 className="card-title">Welcome Back!</h3>
          <p>User ID: {userId}</p>
          <p>Your Role: {role}</p>
          {role === "driver" ? (
            <p>
              As a driver, you can view your assigned orders, track deliveries,
              and update your status.
            </p>
          ) : (
            <p>
              As a customer, you can manage your subscriptions, schedule
              pickups, and view your order history.
            </p>
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
