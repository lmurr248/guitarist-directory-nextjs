"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        <Link className={`link ${pathname === "/" ? "active" : ""}`} href="/">
          <li>Home</li>
        </Link>
        <Link
          className={`link ${pathname === "/login" ? "active" : ""}`}
          href="/login"
        >
          <li>Log In</li>
        </Link>
        <Link
          className={`link ${pathname === "/dashboard" ? "active" : ""}`}
          href="/dashboard"
        >
          <li>Dashboard</li>
        </Link>
      </ul>
    </nav>
  );
}
