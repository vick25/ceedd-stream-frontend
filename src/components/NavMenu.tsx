"use client";
import clsx from "clsx";
import {
  BadgeCheck,
  Building2,
  Globe,
  Image,
  Images,
  Landmark,
  LayoutGrid,
  User,
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
    href: "/dashboard/customer",
  },
  {
    icon: Landmark,
    name: "bailleur",
    href: "/dashboard/bailleur",
  },
  {
    icon: BadgeCheck,
    name: "Inspection",
    href: "/dashboard/inspection",
  },
  {
    icon: Globe,
    name: "zonecontributive",
    href: "/dashboard/zonecontributive",
  },
  {
    icon: Images,
    name: "Photo",
    href: "/dashboard/photo",
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
              "flex md:h-[48px] grow items-center  gap-2 rounded-md bg-white p-3 md:px-6 md:py-6 text-sm font-medium",
              {
                "bg-sky-100 text-blue-600": pathName === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <span className="hidden md:block"> {link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
