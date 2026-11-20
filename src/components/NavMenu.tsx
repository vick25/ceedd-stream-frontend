"use client";

import clsx from "clsx";
import {
  BadgeCheck,
  Building2,
  Globe,
  Images,
  Landmark,
  LayoutGrid,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    icon: LayoutGrid,
    name: "Home",
    href: "/dashboard",
  },
  {
    icon: User,
    name: "Client",
    href: "/dashboard/clients",
  },
  {
    icon: Building2,
    name: "Infrastructure",
    href: "/dashboard/infrastructures",
  },
  {
    icon: Landmark,
    name: "Bailleur",
    href: "/dashboard/bailleurs",
  },
  {
    icon: BadgeCheck,
    name: "Inspection",
    href: "/dashboard/inspections",
  },
  {
    icon: Globe,
    name: "Zone contributive",
    href: "/dashboard/zonecontributives",
  },
  {
    icon: Images,
    name: "Photo",
    href: "/dashboard/photos",
  },
];

export default function NavMenu() {
  const pathName = usePathname();
  return (
    <nav aria-label="Navigation principale" className="flex flex-col gap-1 px-3">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            title={link.name}
            className={clsx(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 md:px-4",
              {
                "bg-blue-50 font-semibold text-blue-700 ring-1 ring-inset ring-blue-100 hover:bg-blue-50 hover:text-blue-700": pathName === link.href || (link.href !== "/dashboard" && pathName.startsWith(`${link.href}/`)),
              }
            )}
          >
            <LinkIcon className="h-[18px] w-[18px] shrink-0 text-current opacity-75 transition-opacity group-hover:opacity-100" />
            <span className="hidden md:block">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
