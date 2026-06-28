"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/revenue", label: "Revenue" },
  { href: "/admin/moderation", label: "Moderation" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="w-56 border-r border-gray-800 p-4 space-y-1">
        <Link href="/admin/projects" className="block text-lg font-bold mb-6">
          Devlop Admin
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded px-3 py-2 text-sm ${
              pathname.startsWith(item.href)
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-800 px-6 py-3 flex justify-end">
          <UserButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
