"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard" },
  { href: "/portal/kanban", label: "Changes" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/billing", label: "Billing" },
  { href: "/portal/settings", label: "Settings" },
];

interface CreditInfo {
  balance: number;
  total: number;
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [credits, setCredits] = useState<CreditInfo | null>(null);

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => setCredits(d))
      .catch(() => {});
  }, [pathname]);

  const lowCredits = credits && credits.total > 0 && credits.balance / credits.total <= 0.2;

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/portal/dashboard" className="text-xl font-bold">
            Devlop
          </Link>
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm ${
                  pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {credits && (
            <div
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                lowCredits
                  ? "bg-red-900/50 text-red-400"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {credits.balance} credits remaining
            </div>
          )}
          <UserButton />
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden flex border-b border-gray-800 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-3 text-sm whitespace-nowrap ${
              pathname === item.href
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
