"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin-dashboard",
    },
    {
      label: "Doctor Approvals",
      icon: Users,
      path: "/admin-dashboard/doctors",
    },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-primary">
            AharaSetu
          </h2>
          <p className="text-sm text-muted-foreground">
            Admin Panel
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-destructive"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
