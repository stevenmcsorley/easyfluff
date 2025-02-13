// app/routes/index.tsx
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to EasyFluff</h1>
          <p className="py-6">
            Say goodbye to laundry day! With EasyFluff, your laundry is picked
            up, washed, folded, and delivered on schedule.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/auth/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/subscriptions" className="btn btn-outline">
              View Subscription Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
