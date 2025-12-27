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
    icon: Building2,
    name: "Infrastructure",
    href: "/dashboard/infrastructures",
  },
  {
    icon: User,
    name: "Client",
    href: "/dashboard/clients",
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
    href: "/dashboard/zonecontibutives",
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
    <div className="flex flex-col md:flex-col ">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex md:h-12 grow items-center  gap-2 rounded-md bg-white p-3 md:px-6 md:py-6 text-sm font-medium hover:bg-blue-100 hover:text-blue-500 px-3 py-3",
              {
                "bg-blue-100 text-blue-500": pathName === link.href,
              }
            )}
          >
            <LinkIcon className="w-4 text-blue-400 " />
            <span className="hidden md:block "> {link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
