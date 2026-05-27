"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, Plus, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/quests", label: "Quests" },
  { href: "/create", label: "Create" },
  { href: "/review", label: "Review" },
  { href: "/profile/0x2F18...4C9A", label: "Profile" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-700/70 bg-[#0B1020]/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-400 text-[#0B1020] shadow-glow">
            <BadgeCheck className="h-5 w-5" />
          </span>
          <span className="text-lg">BuildProof</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-slate-800 hover:text-foreground",
                pathname === link.href && "bg-slate-800 text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/create" className="hidden sm:block">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              New quest
            </Button>
          </Link>
          <Button size="sm">
            <WalletCards className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </nav>
    </header>
  );
}
