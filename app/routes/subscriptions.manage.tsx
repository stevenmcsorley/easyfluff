// app/routes/subscriptions/manage.tsx

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { client } from "~/utils/db.server";
import { getSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Check if the user is logged in
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  // Get the active subscription (if any) for the user
  const subResult = await client.query(
    `SELECT us.*, s.name, s.description, s.price, s.frequency
     FROM user_subscriptions us
     JOIN subscriptions s ON us.subscription_id = s.id
     WHERE us.user_id = $1 AND us.active = true`,
    [userId]
  );
  const currentSubscription =
    subResult && subResult.rowCount !== null && subResult.rowCount > 0
      ? subResult.rows[0]
      : null;

  // Query all available subscription plans
  const planResult = await client.query(
    "SELECT * FROM subscriptions ORDER BY id ASC"
  );
  const plans = planResult.rows;

  return json({ currentSubscription, plans });
};

export const action: ActionFunction = async ({ request }) => {
  // Ensure the user is logged in
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return redirect("/auth/login");
  }

  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "update") {
    const newPlanId = formData.get("planId");
    if (typeof newPlanId !== "string" || newPlanId.trim() === "") {
      return json({ error: "Invalid subscription plan" }, { status: 400 });
    }
    // Update the user's active subscription with the new plan
    await client.query(
      `UPDATE user_subscriptions 
       SET subscription_id = $1, updated_at = NOW()
       WHERE user_id = $2 AND active = true`,
      [newPlanId, userId]
    );
    return redirect("/dashboard");
  } else if (actionType === "cancel") {
    // Cancel the user's active subscription by setting it to inactive
    await client.query(
      `UPDATE user_subscriptions 
       SET active = false, updated_at = NOW()
       WHERE user_id = $1 AND active = true`,
      [userId]
    );
    return redirect("/dashboard");
  } else {
    return json({ error: "Unknown action" }, { status: 400 });
  }
};

export default function ManageSubscription() {
  const { currentSubscription, plans } = useLoaderData<typeof loader>();
  const transition = useNavigation();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Manage Subscription
      </h2>

      {currentSubscription ? (
        <div className="mb-6 border p-4 rounded">
          <h4 className="text-xl font-bold">
            Current Subscription: {currentSubscription.name}
          </h4>
          <p>{currentSubscription.description}</p>
          <p className="mt-2 font-bold">
            Price: ${currentSubscription.price} per{" "}
            {currentSubscription.frequency}
          </p>
        </div>
      ) : (
        <p className="mb-6 text-center text-red-600">
          You have no active subscription.
        </p>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">Update Your Subscription</h3>
        <Form method="post">
          <input type="hidden" name="action" value="update" />
          <select
            name="planId"
            className="select select-bordered w-full mb-4"
            defaultValue={currentSubscription?.subscription_id || ""}
          >
            <option value="">Select a new plan</option>
            {plans.map(
              (plan: {
                id: number;
                name: string;
                price: number;
                frequency: string;
              }) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price} per {plan.frequency}
                </option>
              )
            )}
          </select>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting"
              ? "Updating..."
              : "Update Subscription"}
          </button>
        </Form>
      </div>

      {currentSubscription && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Cancel Subscription</h3>
          <Form method="post">
            <input type="hidden" name="action" value="cancel" />
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={transition.state === "submitting"}
            >
              {transition.state === "submitting"
                ? "Cancelling..."
                : "Cancel Subscription"}
            </button>
          </Form>
        </div>
      )}
    </div>
  );
}
