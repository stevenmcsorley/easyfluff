// app/routes/orders.tsx

import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";
import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  // Query orders for the logged-in user.
  // Ensure your orders table includes columns such as scheduled_pickup and pickup_address.
  const result = await client.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  return json({ orders: result.rows });
};

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">
        My Orders & Scheduled Pickups
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Scheduled Pickup</th>
              <th>Pickup Address</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(
              (order: {
                id: number;
                status: string;
                scheduled_pickup: string | null;
                pickup_address: string | null;
                created_at: string | null;
              }) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.scheduled_pickup
                      ? new Date(order.scheduled_pickup).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{order.pickup_address || "N/A"}</td>
                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
