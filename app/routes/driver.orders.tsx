// app/routes/driver/orders.tsx

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

  // Query available orders: those not yet assigned (driver_id is NULL)
  // and with a status of 'Scheduled'
  const result = await client.query(
    "SELECT * FROM orders WHERE driver_id IS NULL AND status = 'Scheduled' ORDER BY scheduled_pickup ASC",
    [userId]
  );
  const orders = result.rows;
  return json({ orders });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const role = session.get("role");

  if (!userId || role !== "driver") {
    return redirect("/auth/login");
  }

  const formData = await request.formData();
  const orderId = formData.get("orderId");
  if (typeof orderId !== "string") {
    return json({ error: "Invalid order id" }, { status: 400 });
  }

  // Update the order: assign this driver and update status (e.g., to 'In Process')
  await client.query(
    `UPDATE orders 
     SET driver_id = $1, status = 'In Process', updated_at = NOW()
     WHERE id = $2`,
    [userId, orderId]
  );

  return redirect("/driver/orders");
};

export default function DriverOrders() {
  const { orders } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center">No available orders at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order: any) => (
            <div key={order.id} className="card shadow-lg bg-base-100 p-4">
              <h3 className="card-title">Order #{order.id}</h3>
              <p>Pickup Address: {order.pickup_address || "N/A"}</p>
              <p>
                Scheduled Pickup:{" "}
                {order.scheduled_pickup
                  ? new Date(order.scheduled_pickup).toLocaleString()
                  : "N/A"}
              </p>
              <p>Status: {order.status}</p>
              <Form method="post">
                <input type="hidden" name="orderId" value={order.id} />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={navigation.state === "submitting"}
                >
                  {navigation.state === "submitting"
                    ? "Accepting..."
                    : "Accept Order"}
                </button>
              </Form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
