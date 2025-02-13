// app/routes/dashboard.tsx

import { Link } from "@remix-run/react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>
      <div className="card bg-base-100 shadow-xl p-4 mb-6">
        <div className="card-body">
          <h3 className="card-title">Your Subscription</h3>
          <p>
            Current Plan:{" "}
            <span className="font-bold">Standard Plan (2 bags per week)</span>
          </p>
          <div className="card-actions justify-end mt-4">
            <Link to="/subscriptions" className="btn btn-outline">
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Link to="/orders" className="btn btn-primary">
          View Order History
        </Link>
      </div>
    </div>
  );
}
