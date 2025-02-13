// app/routes/orders.tsx

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Dummy orders data
const dummyOrders = [
  { id: 1, status: "Scheduled", date: "2025-02-15" },
  { id: 2, status: "Delivered", date: "2025-02-08" },
];

export const loader = async () => {
  // In a real application, fetch the orders for the logged-in user from the database.
  return json({ orders: dummyOrders });
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
