// app/routes/subscriptions.tsx

import { Form, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

// Dummy subscription plans for MVP
const subscriptionPlans = [
  { id: "basic", name: "Basic", price: 30, description: "1 bag per week" },
  {
    id: "standard",
    name: "Standard",
    price: 50,
    description: "2 bags per week",
  },
  { id: "family", name: "Family", price: 80, description: "4 bags per week" },
];

export const loader = async () => {
  // In a real application, fetch plans from a database
  return json({ plans: subscriptionPlans });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const planId = formData.get("planId");
  // Process the subscription request (store it in your database, etc.)
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
