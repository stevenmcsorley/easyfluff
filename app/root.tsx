// app/root.tsx
import "./tailwind.css";

import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";

import { getSession } from "~/session.server";
import { json } from "@remix-run/node";

// Loader: Retrieve session data (userId and email) for the header.
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const email = session.get("email");
  return json({ userId, email });
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {
  return (
    <html lang="en" data-theme="sunset">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-base-200 text-base-content min-h-screen flex flex-col">
        <Header />

        <Outlet />

        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { userId, email } = useLoaderData<typeof loader>();

  return (
    <header className="navbar bg-base-100 shadow mb-6">
      <div className="flex w-full items-center justify-between px-4">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          EasyFluff
        </Link>
        <nav className="flex items-center space-x-2">
          {userId ? (
            <>
              <span className="mr-4">Logged in as: {email}</span>
              <Link to="/dashboard" className="btn btn-sm btn-outline">
                Dashboard
              </Link>
              <Form action="/auth/logout" method="post" reloadDocument>
                <button type="submit" className="btn btn-sm btn-ghost">
                  Logout
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="btn btn-sm btn-outline">
                Login
              </Link>
              <Link to="/auth/register" className="btn btn-sm btn-ghost">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="p-4 text-center bg-base-300 mt-6">
      <p className="text-sm text-base-content/70">
        &copy; {new Date().getFullYear()} EasyFluff. All rights reserved.
      </p>
    </footer>
  );
}

// CatchBoundary: Renders a custom 404 message when no route is matched.
export function CatchBoundary() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <h1 className="text-5xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">
        Sorry, we couldn’t find the page you were looking for.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Return Home
      </Link>
    </div>
  );
}
