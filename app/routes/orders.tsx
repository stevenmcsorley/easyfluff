// app/routes/orders.tsx

import { json, redirect } from "@remix-run/node";

import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  // Query orders for the logged-in user from the database.
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
      <h2 className="text-3xl font-bold mb-4 text-center">My Orders</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
