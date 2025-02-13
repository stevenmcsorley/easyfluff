// app/root.tsx
import "./tailwind.css";

import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

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
        <main className="container mx-auto flex-1 p-4">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="navbar bg-base-100 shadow mb-6">
      <div className="flex w-full items-center justify-between px-4">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          EasyFluff
        </Link>
        {/* Add any extra header items (e.g. language switcher) here */}
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

// CatchBoundary: renders for unmatched routes.
// It returns only inner content so that it’s rendered inside the root layout.
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
