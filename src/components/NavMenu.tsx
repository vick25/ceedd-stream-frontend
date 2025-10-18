"use client";
import clsx from "clsx";
import { Building2, LayoutGrid, User } from "lucide-react";
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
              "flex md:h-[48px] grow items-center  gap-2 rounded-md bg-white p-3 text-sm font-medium",
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
