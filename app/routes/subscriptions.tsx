// app/routes/subscriptions.tsx

import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";

export const loader = async ({ request }: { request: Request }) => {
  // Check if the user is logged in
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  // Query the available subscription plans from the database
  // (Assuming you have a "subscriptions" table populated.)
  const result = await client.query(
    "SELECT * FROM subscriptions ORDER BY id ASC"
  );
  return json({ plans: result.rows });
};

export const action = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  const formData = await request.formData();
  const planId = formData.get("planId");
  if (typeof planId !== "string") {
    return json({ error: "Invalid subscription plan" }, { status: 400 });
  }

  // Insert a new subscription record into the user_subscriptions table.
  // You can customize the fields as needed.
  await client.query(
    `INSERT INTO user_subscriptions (user_id, subscription_id, start_date, active)
     VALUES ($1, $2, NOW(), true)`,
    [userId, planId]
  );

  return redirect("/dashboard");
};

export default function Subscriptions() {
  const { plans } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Choose Your Subscription Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <div key={plan.id} className="card shadow-lg bg-base-100">
            <div className="card-body">
              <h3 className="card-title">{plan.name}</h3>
              <p>{plan.description}</p>
              <p className="text-lg font-bold">${plan.price} per month</p>
              <Form method="post">
                <input type="hidden" name="planId" value={plan.id} />
                <button type="submit" className="btn btn-primary mt-4">
                  Select Plan
                </button>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
